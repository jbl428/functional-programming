## 중첩된 context 문제

일반적인 문제를 풀기 위해 무언가 더 필요한 이유를 보여주는 몇가지 예제를 살펴봅시다.

**예제** (`F = Array`)

Follower 들의 follower 가 필요한 상황이라 가정합시다.


```typescript
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/ReadonlyArray'

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const getFollowers = (user: User): ReadonlyArray<User> => user.followers

declare const user: User

// followersOfFollowers: ReadonlyArray<ReadonlyArray<User>>
const followersOfFollowers = pipe(user, getFollowers, A.map(getFollowers))
```

여기서 문제가 발생합니다, `followersOfFollowers` 의 타입은 `ReadonlyArray<ReadonlyArray<User>>` 이지만 우리가 원하는 것은 `ReadonlyArray<User>` 입니다.

중첩된 배열의 **평탄화(flatten)** 가 필요합니다.

`fp-ts/ReadonlyArray` 모듈에 있는 함수 `flatten: <A>(mma: ReadonlyArray<ReadonlyArray<A>>) => ReadonlyArray<A>` 가 바로 우리가 원하는 것입니다:

```typescript
// followersOfFollowers: ReadonlyArray<User>
const followersOfFollowers = pipe(
  user,
  getFollowers,
  A.map(getFollowers),
  A.flatten
)
```

좋습니다! 다른 자료형도 살펴봅시다.

**예제** (`F = Option`)

숫자 배열의 첫 번째 요소의 역수를 계산한다고 가정합시다:

```typescript
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'

const inverse = (n: number): O.Option<number> =>
  n === 0 ? O.none : O.some(1 / n)

// inverseHead: O.Option<O.Option<number>>
const inverseHead = pipe([1, 2, 3], A.head, O.map(inverse))
```

이런, 같은 현상이 발생합니다, `inverseHead` 의 타입은 `Option<Option<number>>` 이지만 우리가 원하는 것은 `Option<number>` 입니다.

이번에도 중첩된 `Option` 를 평평하게 만들어야 합니다.

`fp-ts/Option` 모듈에 있는 함수 `flatten: <A>(mma: Option<Option<A>>) => Option<A>` 가 우리가 원하는 것입니다:

```typescript
// inverseHead: O.Option<number>
const inverseHead = pipe([1, 2, 3], A.head, O.map(inverse), O.flatten)
```

모든 곳에 `flatten` 함수가 있는데... 이것은 우연은 아닙니다. 다음과 같은 함수형 패턴이 존재합니다:

두 type constructor `ReadonlyArray` 와 `Option` (그 외 여러) 은 **monad 인스턴스** 를 가지고 있습니다.

> `flatten` 은 monad 의 가장 특별한 연산입니다

**참고**. `flatten` 의 자주 사용되는 동의어로 **join** 이 있습니다.

그럼 monad 란 무엇일까요?

보통 다음과 같이 표현합니다...
