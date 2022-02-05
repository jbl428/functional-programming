## `concatAll` 함수

정의상 `concat` 은 단지 2개의 요소 `A` 를 조합합니다. 몇 개라도 조합이 가능할까요?

`concatAll` 함수는 다음 값을 요구합니다:

- semigroup 인스턴스
- 초기값
- 요소의 배열

```ts
import * as S from 'fp-ts/Semigroup'
import * as N from 'fp-ts/number'

const sum = S.concatAll(N.SemigroupSum)(2)

console.log(sum([1, 2, 3, 4])) // => 12

const product = S.concatAll(N.SemigroupProduct)(3)

console.log(product([1, 2, 3, 4])) // => 72
```

**문제**. 왜 초기값을 제공해야 할까요?

**예제**

Javascript 기본 라이브러리의 유명한 함수 몇가지를 `concatAll` 으로 구현해봅시다.

```ts
import * as B from 'fp-ts/boolean'
import { concatAll } from 'fp-ts/Semigroup'
import * as S from 'fp-ts/struct'

const every = <A>(predicate: (a: A) => boolean) => (
  as: ReadonlyArray<A>
): boolean => concatAll(B.SemigroupAll)(true)(as.map(predicate))

const some = <A>(predicate: (a: A) => boolean) => (
  as: ReadonlyArray<A>
): boolean => concatAll(B.SemigroupAny)(false)(as.map(predicate))

const assign: (as: ReadonlyArray<object>) => object = concatAll(
  S.getAssignSemigroup<object>()
)({})
```

**문제**. 다음 인스턴스는 semigroup 법칙을 만족합니까?

```ts
import { Semigroup } from 'fp-ts/Semigroup'

/** 항상 첫 번째 인자를 반환 */
const first = <A>(): Semigroup<A> => ({
  concat: (first, _second) => first
})
```

**문제**. 다음 인스턴스는 semigroup 법칙을 만족합니까?

```ts
import { Semigroup } from 'fp-ts/Semigroup'

/** 항상 두 번째 인자를 반환 */
const last = <A>(): Semigroup<A> => ({
  concat: (_first, second) => second
})
```
