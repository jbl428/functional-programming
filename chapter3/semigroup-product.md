## Semigroup product

더 복잡한 semigroup 인스턴스를 정의해봅시다:

```ts
import * as N from 'fp-ts/number'
import { Semigroup } from 'fp-ts/Semigroup'

// 정점에서 시작하는 vector 를 모델링
type Vector = {
  readonly x: number
  readonly y: number
}

// 두 vector 의 합을 모델링
const SemigroupVector: Semigroup<Vector> = {
  concat: (first, second) => ({
    x: N.SemigroupSum.concat(first.x, second.x),
    y: N.SemigroupSum.concat(first.y, second.y)
  })
}
```

**예제**

```ts
const v1: Vector = { x: 1, y: 1 }
const v2: Vector = { x: 1, y: 2 }

console.log(SemigroupVector.concat(v1, v2)) // => { x: 2, y: 3 }
```

<p align="center">
    <img src="/images/semigroupVector.png" width="300" alt="SemigroupVector" />
</p>

boilerplate 코드가 너무 많나요? 좋은 소식은 semigroup 의 **수학적 법칙**에 따르면 각 필드에 대한 semigroup 인스턴스를 만들 수 있다면 `Vector` 같은 구조체의 semigroup 인스턴스를 만들 수 있습니다.

편리하게도 `fp-ts/Semigroup` 모둘은 `struct` combinator 를 제공합니다:

```ts
import { struct } from 'fp-ts/Semigroup'

// 두 vector 의 합을 모델링
const SemigroupVector: Semigroup<Vector> = struct({
  x: N.SemigroupSum,
  y: N.SemigroupSum
})
```

**Note**. `struct` 와 유사한 tuple 에 대해 동작하는 combinator 도 존재합니다: `tuple`

```ts
import * as N from 'fp-ts/number'
import { Semigroup, tuple } from 'fp-ts/Semigroup'

// 정점에서 시작하는 vector 모델링
type Vector = readonly [number, number]

// 두 vector 의 합을 모델링
const SemigroupVector: Semigroup<Vector> = tuple(N.SemigroupSum, N.SemigroupSum)

const v1: Vector = [1, 1]
const v2: Vector = [1, 2]

console.log(SemigroupVector.concat(v1, v2)) // => [2, 3]
```

**문제**. 만약 임의의 `Semigroup<A>` 와 `A` 의 임의의 값 middle 을 두 `concat` 인자 사이에 넣도록 만든 인스턴스는 여전히 semigroup 일까요?

```ts
import { pipe } from 'fp-ts/function'
import { Semigroup } from 'fp-ts/Semigroup'
import * as S from 'fp-ts/string'

export const intercalate = <A>(middle: A) => (
  S: Semigroup<A>
): Semigroup<A> => ({
  concat: (first, second) => S.concat(S.concat(first, middle), second)
})

const SemigroupIntercalate = pipe(S.Semigroup, intercalate('|'))

pipe(
  SemigroupIntercalate.concat('a', SemigroupIntercalate.concat('b', 'c')),
  console.log
) // => 'a|b|c'
```
