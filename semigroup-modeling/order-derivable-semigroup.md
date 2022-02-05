## Order-derivable Semigroups

만약 주어진 `number` 가 **total order** (전순서 집합, 어떤 임의의 `x` 와 `y` 를 선택해도, 다음 두 조건 중 하나가 참이다: `x <= y` 또는 `y <= x`) 라면 `min` 또는 `max` 연산을 활용해 또 다른 두 개의 `Semigroup<number>` 인스턴스를 얻을 수 있습니다.

```typescript
import { Semigroup } from 'fp-ts/Semigroup'

const SemigroupMin: Semigroup<number> = {
  concat: (first, second) => Math.min(first, second)
}

const SemigroupMax: Semigroup<number> = {
  concat: (first, second) => Math.max(first, second)
}
```

**문제**. 왜 `number` 가 _total order_ 이어야 할까요?

이러한 두 semigroup (`SemigroupMin` 과 `SemigroupMax`) 을 `number` 외 다른 타입에 대해서 정의한다면 유용할 것입니다.

다른 타입에 대해서도 _전순서 집합_ 이라는 개념을 적용할 수 있을까요?

_순서_ 의 개념을 설명하기 앞서 _동등_ 의 개념을 생각할 필요가 있습니다.
