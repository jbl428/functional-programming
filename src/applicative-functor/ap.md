## `ap` 연산

다음과 같은 상황을 가정합시다:

- `follower` 는 없지만 그의 `id` 를 가지고 있습니다
- `user` 는 없지만 그의 `id` 를 가지고 있습니다
- 주어진 `id` 에 대한 `User` 를 가져오는 `fetchUser` API 가 있습니다

```typescript
import * as T from 'fp-ts/Task'

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const addFollower = (follower: User) => (user: User): User => ({
  ...user,
  followers: [...user.followers, follower]
})

declare const fetchUser: (id: number) => T.Task<User>

const userId = 1
const followerId = 3

const result = addFollower(fetchUser(followerId))(fetchUser(userId)) // 컴파일 되지 않습니다
```

더이상 `addFollower` 를 사용할 수 없습니다! 어떻게 해야할까요?

다음 시그니쳐를 가진 함수만 있으면 가능할거 같습니다:

```typescript
declare const addFollowerAsync: (
  follower: T.Task<User>
) => (user: T.Task<User>) => T.Task<User>
```

그러면 다음과 같이 진행할 수 있습니다:

```typescript
import * as T from 'fp-ts/Task'

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

declare const fetchUser: (id: number) => T.Task<User>

declare const addFollowerAsync: (
  follower: T.Task<User>
) => (user: T.Task<User>) => T.Task<User>

const userId = 1
const followerId = 3

// const result: T.Task<User>
const result = addFollowerAsync(fetchUser(followerId))(fetchUser(userId)) // 컴파일 됩니다
```

물론 직접 `addFollowerAsyn` 를 구현할 수 있습니다만, 함수 `addFollower: (follower: User) => (user: User): User` 에서 시작해 함수 `addFollowerAsync: (follower: Task<User>) => (user: Task<User>) => Task<User>` 로 만드는 변환을 찾는게 가능할까요?

더 일반적으로, 우리가 원하는 것은 `liftA2` 라고 불리는 변환이며, 함수 `g: (b: B) => (c: C) => D` 에서 다음과 같은 시그니쳐를 가진 함수를 반환합니다:

```typescript
liftA2(g): (fb: F<B>) => (fc: F<C>) => F<D>
```

<img src="../images/liftA2.png" width="500" alt="liftA2" />

어떻게 구할 수 있을까요? 주어진 `g` 는 unary 함수이므로, functor 인스턴스와 `map` 을 활용할 수 있습니다:

```typescript
map(g): (fb: F<B>) => F<(c: C) => D>
```

<img src="../images/liftA2-first-step.png" width="500" alt="liftA2 (첫 단계)" />

이제 문제가 발생합니다: functor 인스턴스는 타입 `F<(c: C) => D>` 에서 `(fc: F<C>) => F<D>` 로 만드는 연산을 지원하지 않습니다.

이제 이 기능을 위한 새로운 연산인 `ap` 를 도입할 필요가 있습니다: 

```typescript
declare const ap: <A>(fa: Task<A>) => <B>(fab: Task<(a: A) => B>) => Task<B>
```


**참고**. 왜 이름이 "ap" 일까요? 왜냐하면 마치 함수 적용과 같은 형태를 보이기 때문입니다. 

```typescript
// `apply` 는 값을 함수에 적용합니다
declare const apply: <A>(a: A) => <B>(f: (a: A) => B) => B

declare const ap: <A>(a: Task<A>) => <B>(f: Task<(a: A) => B>) => Task<B>
// `ap` 는 effect 에 감싸진 값을 effect 에 감싸진 함수에 적용합니다
```

이제 `ap` 가 있으니 `liftA2` 를 정의할 수 있습니다:

```typescript
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

const liftA2 = <B, C, D>(g: (b: B) => (c: C) => D) => (fb: T.Task<B>) => (
  fc: T.Task<C>
): T.Task<D> => pipe(fb, T.map(g), T.ap(fc))

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const addFollower = (follower: User) => (user: User): User => ({
  ...user,
  followers: [...user.followers, follower]
})

// const addFollowerAsync: (fb: T.Task<User>) => (fc: T.Task<User>) => T.Task<User>
const addFollowerAsync = liftA2(addFollower)
```

마침내, 우리는 이전 결과에서 `fetchUser` 를 합성할 수 있습니다:

```typescript
import { flow, pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

const liftA2 = <B, C, D>(g: (b: B) => (c: C) => D) => (fb: T.Task<B>) => (
  fc: T.Task<C>
): T.Task<D> => pipe(fb, T.map(g), T.ap(fc))

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const addFollower = (follower: User) => (user: User): User => ({
  ...user,
  followers: [...user.followers, follower]
})

declare const fetchUser: (id: number) => T.Task<User>

// const program: (id: number) => (fc: T.Task<User>) => T.Task<User>
const program = flow(fetchUser, liftA2(addFollower))

const userId = 1
const followerId = 3

// const result: T.Task<User>
const result = program(followerId)(fetchUser(userId))
```

이제 두 함수 `f: (a: A) => F<B>` 와 `g: (b: B, c: C) => D` 를 합성하는 표준적 절차를 얻었습니다:
We have found a standard procedure to compose two functions `f: (a: A) => F<B>`, `g: (b: B, c: C) => D`:

1. `g` 를 currying 을 통해 함수 `g: (b: B) => (c: C) => D` 로 변환합니다
2. Effect `F` 를 위한 `ap` 함수를 정의합니다 (라이브러리 함수)
3. Effect `F` 를 위한 `liftA2` 함수를 정의합니다 (라이브러리 함수)
4. 다음 합성을 수행합니다 `flow(f, liftA2(g))`

이전에 본 type constructor 일부에 대한 `ap` 연산의 구현을 살펴봅시다:

**예제** (`F = ReadonlyArray`)

```typescript
import { increment, pipe } from 'fp-ts/function'

const ap = <A>(fa: ReadonlyArray<A>) => <B>(
  fab: ReadonlyArray<(a: A) => B>
): ReadonlyArray<B> => {
  const out: Array<B> = []
  for (const f of fab) {
    for (const a of fa) {
      out.push(f(a))
    }
  }
  return out
}

const double = (n: number): number => n * 2

pipe([double, increment], ap([1, 2, 3]), console.log) // => [ 2, 4, 6, 2, 3, 4 ]
```

**예제** (`F = Option`)

```typescript
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

const ap = <A>(fa: O.Option<A>) => <B>(
  fab: O.Option<(a: A) => B>
): O.Option<B> =>
  pipe(
    fab,
    O.match(
      () => O.none,
      (f) =>
        pipe(
          fa,
          O.match(
            () => O.none,
            (a) => O.some(f(a))
          )
        )
    )
  )

const double = (n: number): number => n * 2

pipe(O.some(double), ap(O.some(1)), console.log) // => some(2)
pipe(O.some(double), ap(O.none), console.log) // => none
pipe(O.none, ap(O.some(1)), console.log) // => none
pipe(O.none, ap(O.none), console.log) // => none
```

**예제** (`F = IO`)

```typescript
import { IO } from 'fp-ts/IO'

const ap = <A>(fa: IO<A>) => <B>(fab: IO<(a: A) => B>): IO<B> => () => {
  const f = fab()
  const a = fa()
  return f(a)
}
```

**예제** (`F = Task`)

```typescript
import { Task } from 'fp-ts/Task'

const ap = <A>(fa: Task<A>) => <B>(fab: Task<(a: A) => B>): Task<B> => () =>
  Promise.all([fab(), fa()]).then(([f, a]) => f(a))
```

**예제** (`F = Reader`)

```typescript
import { Reader } from 'fp-ts/Reader'

const ap = <R, A>(fa: Reader<R, A>) => <B>(
  fab: Reader<R, (a: A) => B>
): Reader<R, B> => (r) => {
  const f = fab(r)
  const a = fa(r)
  return f(a)
}
```

지금까지 `ap` 가 두 개의 파라미터를 받는 함수를 다루는 것을 보았습니다. 하지만 함수가 **세 개의** 파라미터를 받는다면 어떡할까요? _또 다른 추상화_ 가 필요할까요?

다행이도 필요하지 않습니다. `map` 과 `ap` 만으로 충분합니다:

```typescript
import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

const liftA3 = <B, C, D, E>(f: (b: B) => (c: C) => (d: D) => E) => (
  fb: T.Task<B>
) => (fc: T.Task<C>) => (fd: T.Task<D>): T.Task<E> =>
  pipe(fb, T.map(f), T.ap(fc), T.ap(fd))

const liftA4 = <B, C, D, E, F>(
  f: (b: B) => (c: C) => (d: D) => (e: E) => F
) => (fb: T.Task<B>) => (fc: T.Task<C>) => (fd: T.Task<D>) => (
  fe: T.Task<E>
): T.Task<F> => pipe(fb, T.map(f), T.ap(fc), T.ap(fd), T.ap(fe))

// etc...
```

이제 "합성 테이블" 을 수정할 수 있습니다:

| 프로그램 f    | 프로그램 g        | 합성              |
|-----------|---------------|-----------------|
| pure      | pure          | `g ∘ f`         |
| effectful | pure (unary)  | `map(g) ∘ f`    |
| effectful | pure, `n`-ary | `liftAn(g) ∘ f` |
