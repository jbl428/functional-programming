## Magma 의 정의

`Magma<A>` 는 매우 간단한 대수입니다:

- 타입 (A) 의 집합
- `concat` 연산
- 지켜야 할 법칙은 없음

**Note**: 대부분의 경우 _set_ 과 _type_ 은 같은 의미로 사용됩니다.

Magma 를 정의하기 위해 Typescript 의 `interface` 를 활용할 수 있습니다.

```typescript
interface Magma<A> {
  readonly concat: (first: A, second: A) => A
}
```

이를통해, 대수를 위한 재료를 얻게됩니다.

- 집합 `A`
- 집합 `A` 에 대한 연산인 `concat`. 이 연산은 집합 `A` 에 대해 _닫혀있다_ 고 말합니다. 임의의 `A` 요소에 대해 연산의 결과도 항상 `A` 이며 이 값은 다시 `concat` 의 입력으로 쓸 수 있습니다. `concat` 은 다른 말로 타입 `A` 의 `combinator` 입니다.

`Magma<A>` 의 구체적인 인스턴스 하나를 구현해봅니다. 여기서 `A` 는 `number` 입니다.

```typescript
import { Magma } from 'fp-ts/Magma'

const MagmaSub: Magma<number> = {
  concat: (first, second) => first - second
}

// helper
const getPipeableConcat = <A>(M: Magma<A>) => (second: A) => (first: A): A =>
  M.concat(first, second)

const concat = getPipeableConcat(MagmaSub)

// 사용 예제

import { pipe } from 'fp-ts/function'

pipe(10, concat(2), concat(3), concat(1), concat(2), console.log)
// => 2
```

**문제**. 위 `concat` 이 _닫힌_ 연산이라는 점은 쉽게 알 수 있습니다. 만약 `A` JavaScript 의 number(양수와 음수 float 집합)가 아닌 가 자연수의 집합(양수로 정의된) 이라면, `MagmaSub` 에 구현된 `concat` 과 같은 연산을 가진 `Magma<Natural>` 을 정의할 수 있을까요? 자연수에 대해 닫혀있지 않는 또다른 `concat` 연산을 생각해 볼 수 있나요?

**정의**. 주어진 `A` 가 공집합이 아니고 이항연산 `*` 가 `A` 에 대해 닫혀있다면, 쌍 `(A, *)` 를 _magma_라 합니다.

Magma 는 닫힘 조건외에 다른 법칙을 요구하지 않습니다. 이제 semigroup 이라는 추가 법칙을 요구하는 대수를 살펴봅시다.
