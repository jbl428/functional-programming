## 단계별 `chain` 정의하기

Monad 의 첫 번째 정의는 `M` 은 functor 인스턴스를 만족해야 함을 의미하며 `g: (b: B) => M<C>` 함수를 `map(g): (mb: M<B>) => M<M<C>>` 로 변경할 수 있다는 사실을 알 수 있습니다.

![h 함수를 얻는 방법](/images/flatMap.png)

이제 문제가 발생합니다: functor 인스턴스를 위한 `M<M<C>>` 타입을 `M<C>` 로 만들어주는 연산이 필요한 상황이며 그러한 연산자를 `flatten` 이라 부르도록 합시다.

만약 이 연산자를 정의할 수 있다면 우리가 원하는 합성 방법을 찾을 수 있습니다:

```
h = flatten ∘ map(g) ∘ f
```

`flatten ∘ map(g)` 이름을 합쳐서 "flatMap" 이라는 이름을 얻을 수 있습니다!

`chain` 도 이 방식으로 얻을 수 있습니다

```
chain = flatten ∘ map(g)
```

![chain 이 함수 g 에 동작하는 방식](/images/chain.png)

이제 합성 테이블을 갱신할 수 있습니다

| 프로그램 f    | 프로그램 g        | 합성              |
|-----------|---------------|-----------------|
| pure      | pure          | `g ∘ f`         |
| effectful | pure (unary)  | `map(g) ∘ f`    |
| effectful | pure, `n`-ary | `liftAn(g) ∘ f` |
| effectful | effectful     | `chain(g) ∘ f`  |

`of` 는 경우는 어떤가요? 사실 `of` 는 _K_ 의 identity morphism 에서 왔습니다. _K_ 의 임의의 identity morphism 인 1A 에 대해 `A` 에서 `M<A>` 로 매칭되는 함수가 존재합니다 (즉 `of: <A>(a: A) => M<A>`).
> (원문) What about `of`? Well, `of` comes from the identity morphisms in _K_: for every identity morphism 1<sub>A</sub> in _K_ there has to be a corresponding function from `A` to `M<A>` (that is, `of: <A>(a: A) => M<A>`).

![of 는 어디서 왔는가](/images/of.png)

`of` 가 `chain` 에 대한 중립 원소라는 사실은 다음과 같은 종류의 흐름 제어를 가능하게 합니다:

```typescript
pipe(
  mb,
  M.chain((b) => (predicate(b) ? M.of(b) : g(b)))
)
```

여기서 `predicate: (b: B) => boolean`, `mb: M<B>` 이며 `g: (b: B) => M<B>`.

마지막 질문: Monad 법칙은 어디에서 온걸까요? 법칙은 단순히 _K_ 에서의 범주형 법칙이 _TS_ 로 변환된 것입니다:

| Law  | _K_                               | _TS_                                                    |
|------|-----------------------------------|---------------------------------------------------------|
| 좌동등성 | 1B ∘ `f'` = `f'`                  | `chain(of) ∘ f = f`                                     |
| 우동등성 | `f'` ∘ 1A = `f'`                  | `chain(f) ∘ of = f`                                     |
| 결합법칙 | `h' ∘ (g' ∘ f') = (h' ∘ g') ∘ f'` | `chain(h) ∘ (chain(g) ∘ f) = chain((chain(h) ∘ g)) ∘ f` |

이제 이전에 본 중첩된 context 문제를 `chain` 을 통해 해결할 수 있습니다:

```typescript
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const getFollowers = (user: User): ReadonlyArray<User> => user.followers

declare const user: User

const followersOfFollowers: ReadonlyArray<User> = pipe(
  user,
  getFollowers,
  A.chain(getFollowers)
)

const inverse = (n: number): O.Option<number> =>
  n === 0 ? O.none : O.some(1 / n)

const inverseHead: O.Option<number> = pipe([1, 2, 3], A.head, O.chain(inverse))
```

지금까지 보았던 type constructor 에 대해 `chain` 함수를 어떻게 구현했는지 살펴봅시다:

**예제** (`F = ReadonlyArray`)

```typescript
// 함수 `B -> ReadonlyArray<C>` 를 함수 `ReadonlyArray<B> -> ReadonlyArray<C>` 로 변환합니다
const chain = <B, C>(g: (b: B) => ReadonlyArray<C>) => (
  mb: ReadonlyArray<B>
): ReadonlyArray<C> => {
  const out: Array<C> = []
  for (const b of mb) {
    out.push(...g(b))
  }
  return out
}
```

**예제** (`F = Option`)

```typescript
import { match, none, Option } from 'fp-ts/Option'

// 함수 `B -> Option<C>` 를 함수 `Option<B> -> Option<C>` 로 변환합니다
const chain = <B, C>(g: (b: B) => Option<C>): ((mb: Option<B>) => Option<C>) =>
  match(() => none, g)
```

**에제** (`F = IO`)

```typescript
import { IO } from 'fp-ts/IO'

// 함수 `B -> IO<C>` 를 함수 `IO<B> -> IO<C>` 로 변환합니다
const chain = <B, C>(g: (b: B) => IO<C>) => (mb: IO<B>): IO<C> => () =>
  g(mb())()
```

**예제** (`F = Task`)

```typescript
import { Task } from 'fp-ts/Task'

// 함수 `B -> Task<C>` 를 함수 `Task<B> -> Task<C>` 로 변환합니다
const chain = <B, C>(g: (b: B) => Task<C>) => (mb: Task<B>): Task<C> => () =>
  mb().then((b) => g(b)())
```

**예제** (`F = Reader`)

```typescript
import { Reader } from 'fp-ts/Reader'

// 함수 `B -> Reader<R, C>` 를 함수 `Reader<R, B> -> Reader<R, C>` 로 변환합니다
const chain = <B, R, C>(g: (b: B) => Reader<R, C>) => (
  mb: Reader<R, B>
): Reader<R, C> => (r) => g(mb(r))(r)
```
