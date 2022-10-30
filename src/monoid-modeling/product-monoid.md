## Product monoid

이미 semigroup 에서 보았듯이, 각 필드에 대해 monoid 인스턴스를 정의할 수 있다면 `구조체`에 대한 monoid 인스턴스를 정의할 수 있습니다.

**예제**

```typescript
import { Monoid, struct } from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'

type Point = {
  readonly x: number
  readonly y: number
}

const Monoid: Monoid<Point> = struct({
  x: N.MonoidSum,
  y: N.MonoidSum
})
```

**참고**. `struct` 와 비슷하게 tuple 에 적용하는 combinator 가 있습니다: `tuple`.

```typescript
import { Monoid, tuple } from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'

type Point = readonly [number, number]

const Monoid: Monoid<Point> = tuple(N.MonoidSum, N.MonoidSum)
```

**문제**. 일반적인 타입 `A` 의 "free monoid" 를 정의할 수 있을까요?

**데모** (캔버스에 기하학적 도형을 그리는 시스템 구현)

[`03_shapes.ts`](../03_shapes.ts)
