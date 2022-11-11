## Functor 로 이어지는 경계

어떤 type constructor `F` 에 대해 `B = F<C>` 를 만족한다고 가정합시다. 그리고 다음과 같은 상황에서:

- `f: (a: A) => F<B>` 는 effectful 프로그램 입니다
- `g: (b: B) => C` 는 순수함수 입니다

`f` 와 `g` 를 합성하기 위해서 `(b: B) => C` 인 `g` 함수를 일반적인 함수 합성을 사용할 수 있는 형태인 `(fb: F<B>) => F<C>` 로 만드는 과정이 필요합니다. (이러면 `f` 의 공역은 새로운 함수의 정의역과 일치하게 됩니다)

<img src="../images/map.png" width="500" alt="map" />

이제 기존 문제를 다음의 새로운 문제로 변경하였습니다: 위 방식을 위한, `map` 이라고 불리는 함수를 찾을 수 있을까요?

실용적인 예제를 살펴봅시다:

**예제** (`F = ReadonlyArray`)

```typescript
import { flow, pipe } from 'fp-ts/function'

// 함수 `B -> C` 를 `ReadonlyArray<B> -> ReadonlyArray<C>` 로 변형합니다
const map = <B, C>(g: (b: B) => C) => (
  fb: ReadonlyArray<B>
): ReadonlyArray<C> => fb.map(g)

// -------------------
// 사용 예제
// -------------------

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const getFollowers = (user: User): ReadonlyArray<User> => user.followers
const getName = (user: User): string => user.name

// getFollowersNames: User -> ReadonlyArray<string>
const getFollowersNames = flow(getFollowers, map(getName))

// `flow` 대신 `pipe` 를 사용해봅시다...
export const getFollowersNames2 = (user: User) =>
  pipe(user, getFollowers, map(getName))

const user: User = {
  id: 1,
  name: 'Ruth R. Gonzalez',
  followers: [
    { id: 2, name: 'Terry R. Emerson', followers: [] },
    { id: 3, name: 'Marsha J. Joslyn', followers: [] }
  ]
}

console.log(getFollowersNames(user)) // => [ 'Terry R. Emerson', 'Marsha J. Joslyn' ]
```

**예제** (`F = Option`)

```typescript
import { flow } from 'fp-ts/function'
import { none, Option, match, some } from 'fp-ts/Option'

// 함수 `B -> C` 를 `Option<B> -> Option<C>` 로 변형합니다
const map = <B, C>(g: (b: B) => C): ((fb: Option<B>) => Option<C>) =>
  match(
    () => none,
    (b) => {
      const c = g(b)
      return some(c)
    }
  )

// -------------------
// 사용 예제
// -------------------

import * as RA from 'fp-ts/ReadonlyArray'

const head: (input: ReadonlyArray<number>) => Option<number> = RA.head
const double = (n: number): number => n * 2

// getDoubleHead: ReadonlyArray<number> -> Option<number>
const getDoubleHead = flow(head, map(double))

console.log(getDoubleHead([1, 2, 3])) // => some(2)
console.log(getDoubleHead([])) // => none
```

**예제** (`F = IO`)

```typescript
import { flow } from 'fp-ts/function'
import { IO } from 'fp-ts/IO'

// 함수 `B -> C` 를 `IO<B> -> IO<C>` 로 변형합니다
const map = <B, C>(g: (b: B) => C) => (fb: IO<B>): IO<C> => () => {
  const b = fb()
  return g(b)
}

// -------------------
// 사용 예제
// -------------------

interface User {
  readonly id: number
  readonly name: string
}

// 더미 인메모리 데이터베이스
const database: Record<number, User> = {
  1: { id: 1, name: 'Ruth R. Gonzalez' },
  2: { id: 2, name: 'Terry R. Emerson' },
  3: { id: 3, name: 'Marsha J. Joslyn' }
}

const getUser = (id: number): IO<User> => () => database[id]
const getName = (user: User): string => user.name

// getUserName: number -> IO<string>
const getUserName = flow(getUser, map(getName))

console.log(getUserName(1)()) // => Ruth R. Gonzalez
```

**예제** (`F = Task`)

```typescript
import { flow } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'

// 함수 `B -> C` 를 `Task<B> -> Task<C>` 로 변형합니다
const map = <B, C>(g: (b: B) => C) => (fb: Task<B>): Task<C> => () => {
  const promise = fb()
  return promise.then(g)
}

// -------------------
// 사용 예제
// -------------------

interface User {
  readonly id: number
  readonly name: string
}

// 더미 원격 데이터베이스
const database: Record<number, User> = {
  1: { id: 1, name: 'Ruth R. Gonzalez' },
  2: { id: 2, name: 'Terry R. Emerson' },
  3: { id: 3, name: 'Marsha J. Joslyn' }
}

const getUser = (id: number): Task<User> => () => Promise.resolve(database[id])
const getName = (user: User): string => user.name

// getUserName: number -> Task<string>
const getUserName = flow(getUser, map(getName))

getUserName(1)().then(console.log) // => Ruth R. Gonzalez
```

**예제** (`F = Reader`)

```typescript
import { flow } from 'fp-ts/function'
import { Reader } from 'fp-ts/Reader'

// 함수 `B -> C` 를 `Reader<R, B> -> Reader<R, C>` 로 변형합니다
const map = <B, C>(g: (b: B) => C) => <R>(fb: Reader<R, B>): Reader<R, C> => (
  r
) => {
  const b = fb(r)
  return g(b)
}

// -------------------
// 사용 예제
// -------------------

interface User {
  readonly id: number
  readonly name: string
}

interface Env {
  // 더미 인메모리 데이터베이스
  readonly database: Record<string, User>
}

const getUser = (id: number): Reader<Env, User> => (env) => env.database[id]
const getName = (user: User): string => user.name

// getUserName: number -> Reader<Env, string>
const getUserName = flow(getUser, map(getName))

console.log(
  getUserName(1)({
    database: {
      1: { id: 1, name: 'Ruth R. Gonzalez' },
      2: { id: 2, name: 'Terry R. Emerson' },
      3: { id: 3, name: 'Marsha J. Joslyn' }
    }
  })
) // => Ruth R. Gonzalez
```

더 일반적으로, type constructor `F` 가 `map` 함수를 가질때, 이를 **functor 인스턴스** 라고 합니다.
> (원문) More generally, when a type constructor `F` admits a `map` function, we say it admits a **functor instance**.

수학적인 관점에서는, functor 는 category 의 구조를 유지하는 **category 간의 map** 이라 할 수 있으며, 이는 identity morphisms 과 합성 연산을 그대로 유지하게 만들어줍니다.

category 는 object 와 morphism 의 쌍이기에, functor 또한 두 개의 쌍입니다:

- _C_ 의 모든 object `X` 를 object _D_ 로 묶는 object 간의 매핑.
- _C_ 의 모든 morphism `f` 를 _D_ 의 morphism `map(f)` 로 묶는 morphism 간의 매핑.

여기서 _C_ 와 _D_ 는 (프로그래밍 언어라고 할 수 있는) category 입니다.

<img src="../images/functor.png" width="500" alt="functor" />

서로 다른 두 프로그래밍 언어의 매핑은 굉장한 아이디어지만, 우리는 _C_ 와 _D_ 가 동일한 상황(_TS_ category) 에서의 매핑에 더 관심이 있습니다. 이 경우에는 **endofunctors** 라고 부릅니다 (그리스어 "endo" 는 "내부" 를 뜻합니다)

앞으로 따로 설명하지 않는한 "functor" 는 _TS_ category 에서의 endofunctor 를 의미합니다.

이제 functor 의 실용적인 면을 알게 되었으니, 공식 정의를 살펴봅시다.
