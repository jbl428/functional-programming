## Dual semigroup

semigroup 인스턴스가 주어지면, 단순히 조합되는 피연산자의 순서를 변경해 새로운 semigroup 인스턴스를 얻을 수 있습니다.

```ts
import { pipe } from 'fp-ts/function'
import { Semigroup } from 'fp-ts/Semigroup'
import * as S from 'fp-ts/string'

// Semigroup combinator
const reverse = <A>(S: Semigroup<A>): Semigroup<A> => ({
  concat: (first, second) => S.concat(second, first)
})

pipe(S.Semigroup.concat('a', 'b'), console.log) // => 'ab'
pipe(reverse(S.Semigroup).concat('a', 'b'), console.log) // => 'ba'
```

**문제**. 이 combinator 이치에 맞습니다만, 일반적으로 `concat` 연산은 [**교환법칙**](https://en.wikipedia.org/wiki/Commutative_property) 을 만족하지 않습니다, 교환법칙을 만족하는 `concat` 과 그렇지 않은것을 찾을 수 있습니까?
