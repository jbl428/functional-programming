## 임의의 타입에 대한 semigroup 인스턴스 찾기

결합법칙은 매우 까다로운 조건이기 때문에, 만약 어떤 타입 `A` 에 대한 결합법칙을 만족하는 연산을 찾을 수 없다면 어떻게될까요?

아래와 같은 `User` 를 정의했다고 가정합시다:

```typescript
type User = {
  readonly id: number
  readonly name: string
}
```
그리고 데이터베이스에는 같은 `User` 에 대한 여러 복사본이 있다고 가정합니다 (예를들면 수정이력일 수 있습니다)

```typescript
// 내부 API
declare const getCurrent: (id: number) => User
declare const getHistory: (id: number) => ReadonlyArray<User>
```

그리고 다음 외부 API 를 구현해야합니다.

```typescript
export declare const getUser: (id: number) => User
```

API 는 다음 조건에 따라 적절한 `User` 를 가져와야 합니다. 조건은 가장 최근 또는 가장 오래된, 아니면 현재 값 등이 될 수 있습니다.

보통은 다음처럼 각 조건에 따라 여러 API 를 만들 수 있습니다:

```typescript
export declare const getMostRecentUser: (id: number) => User
export declare const getLeastRecentUser: (id: number) => User
export declare const getCurrentUser: (id: number) => User
// etc...
```

따라서, `User` 를 반환하기 위해 모든 복사본에 대한 `병합` (이나 `선택`)이 필요합니다. 이는 조건에 대한 문제를 `Semigroup<User>` 로 다룰 수 있다는 것을 의미합니다.

그렇지만, 아직 "두 `User`를 병합하기"가 어떤 의미인지, 그리고 해당 병합 연산이 결합법칙을 만족하는지 알기 쉽지 않습니다.

주어진 **어떠한** 타입 `A` 에 대해서도 **항상** semigroup 인스턴스를 만들 수 있습니다. `A` 자체에 대한 인스턴스가 아닌 `NonEmptyArray<A>` 의 인스턴스로 만들 수 있으며 이는 `A` 의 **free semigroup** 이라고 불립니다.

```typescript
import { Semigroup } from 'fp-ts/Semigroup'

// 적어도 하나의 A 의 요소가 있는 배열을 표현합니다
type ReadonlyNonEmptyArray<A> = ReadonlyArray<A> & {
  readonly 0: A
}

// 비어있지 않은 두 배열을 합해도 여전히 비어있지 않은 배열입니다
const getSemigroup = <A>(): Semigroup<ReadonlyNonEmptyArray<A>> => ({
  concat: (first, second) => [first[0], ...first.slice(1), ...second]
})
```

그러면 `A` 의 요소  `ReadonlyNonEmptyArray<A>` 의 "싱글톤" 으로 만들 수 있으며 이는 하나를 하나의 요소만 있는 배열을 의미합니다.

```typescript
// 비어있지 않은 배열에 값 하나를 넣습니다
const of = <A>(a: A): ReadonlyNonEmptyArray<A> => [a]
```

이 방식을 `User` 타입에도 적용해봅시다:

```typescript
import {
  getSemigroup,
  of,
  ReadonlyNonEmptyArray
} from 'fp-ts/ReadonlyNonEmptyArray'
import { Semigroup } from 'fp-ts/Semigroup'

type User = {
  readonly id: number
  readonly name: string
}

// 이 semigroup 은 `User` 타입이 아닌 `ReadonlyNonEmptyArray<User>` 를 위한 것입니다
const S: Semigroup<ReadonlyNonEmptyArray<User>> = getSemigroup<User>()

declare const user1: User
declare const user2: User
declare const user3: User

// 병합: ReadonlyNonEmptyArray<User>
const merge = S.concat(S.concat(of(user1), of(user2)), of(user3))

// 배열에 직접 user 를 넣어서 같은 결과를 얻을 수 있습니다.
const merge2: ReadonlyNonEmptyArray<User> = [user1, user2, user3]
```

따라서, `A` 의 free semigroup 이란 비어있지 않은 모든 유한 순열을 다루는 semigroup 일 뿐입니다.

`A` 의 free semigroup 이란 데이터 내용을 유지한채로 `A` 의 요소들의 `결합`을 _게으른_ 방법으로 처리하는 것으로 볼 수 있습니다.

이전 예제에서 `[user1, user2, user3]` 을 가지는 `merge` 상수는 어떤 요소가 어떤 순서로 결합되어 있는지 알려줍니다.

이제 `getUser` API 설계를 위한 세 가지 옵션이 있습니다:

1. `Semigroup<User>` 를 정의하고 바로 `병합`한다.

```typescript
declare const SemigroupUser: Semigroup<User>

export const getUser = (id: number): User => {
  const current = getCurrent(id)
  const history = getHistory(id)
  return concatAll(SemigroupUser)(current)(history)
}
```

2. `Semigroup<User>` 을 직접 정의하는 대신 병합 전략을 외부에서 구현하게 한다. 즉 API 사용자가 제공하도록 한다.

```typescript
export const getUser = (SemigroupUser: Semigroup<User>) => (
  id: number
): User => {
  const current = getCurrent(id)
  const history = getHistory(id)
  // 바로 병합
  return concatAll(SemigroupUser)(current)(history)
}
```

3. `Semigroup<User>` 를 정의할 수 없고 외부로 부터 제공받지 않는다.

이럴 때에는 `User` 의 free semigroup 을 활용합니다:

```typescript
export const getUser = (id: number): ReadonlyNonEmptyArray<User> => {
  const current = getCurrent(id)
  const history = getHistory(id)
  // 병합을 진행하지 않고 User 의 free semigroup 을 반환한다
  return [current, ...history]
}
```

`Semigroup<A>` 인스턴스를 만들수 있는 상황일 지라도 다음과 같은 이유로 free semigroup 을 사용하는게 여전히 유용할 수 있습니다:

- 비싸고 무의미한 계산을 하지 않음
- semigroup 인스턴스를 직접 사용하지 않음
- API 사용자에게 (`concatAll` 을 사용해) 어떤 병합전략이 좋을지 결정할 수 있게함
