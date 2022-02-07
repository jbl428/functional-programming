## `concatAll` 함수

semigroup 과 비교해서 monoid 의 한 가지 큰 특징은 다수의 요소를 결합하는게 훨씬 쉬워진다는 것입니다: 더 이상 초기값을 제공하지 않아도 됩니다.

```typescript
import { concatAll } from 'fp-ts/Monoid'
import * as S from 'fp-ts/string'
import * as N from 'fp-ts/number'
import * as B from 'fp-ts/boolean'

console.log(concatAll(N.MonoidSum)([1, 2, 3, 4])) // => 10
console.log(concatAll(N.MonoidProduct)([1, 2, 3, 4])) // => 24
console.log(concatAll(S.Monoid)(['a', 'b', 'c'])) // => 'abc'
console.log(concatAll(B.MonoidAll)([true, false, true])) // => false
console.log(concatAll(B.MonoidAny)([true, false, true])) // => true
```

**문제**. 왜 초기값이 더 이상 필요없을까요?
