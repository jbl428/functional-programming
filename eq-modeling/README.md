# `Eq` 를 활용한 동등성 모델링

이번에는 동등성의 개념을 모델링 해봅시다.

동치관계는 같은 유형의 요소의 동등이라는 개념을 의미합니다. 동치관계의 개념은 Typescript 의 interface 를 통해 구현할 수 있습니다.

```typescript
interface Eq<A> {
  readonly equals: (first: A, second: A) => boolean
}
```

직관적으로:

- 만약 `equals(x, y) = true` 이면, `x` 와 `y` 는 같다고 할 수 있습니다
- 만약 `equals(x, y) = false` 이면, `x` 와 `y` 는 다르다고 할 수 있습니다

**예제**

다음은 `number` 타입에 대한 `Eq` 인스턴스 입니다:

```typescript
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'

const EqNumber: Eq<number> = {
  equals: (first, second) => first === second
}

pipe(EqNumber.equals(1, 1), console.log) // => true
pipe(EqNumber.equals(1, 2), console.log) // => false
```

인스턴스는 다음 법칙을 만족해야 합니다:

1. **반사적**: `A` 의 모든 `x` 에 대해 `equals(x, x) === true` 를 만족합니다
2. **대칭적**: `A` 의 모든 `x`, `y` 에 대해 `equals(x, y) === equals(y, x)` 를 만족합니다
3. **전이적**: `A` 의 모든 `x`, `y`, `z` 에 대해 만약 `equals(x, y) === true` 이고 `equals(y, z) === true` 이면, `equals(x, z) === true` 를 만족합니다

**문제**. 다음 combinator 는 올바른 표현일까요? `reverse: <A>(E: Eq<A>) => Eq<A>`

**문제**. 다음 combinator 는 올바른 표현일까요? `not: <A>(E: Eq<A>) => Eq<A>`

```typescript
import { Eq } from 'fp-ts/Eq'

export const not = <A>(E: Eq<A>): Eq<A> => ({
  equals: (first, second) => !E.equals(first, second)
})
```

**예제**

주어진 요소가 `ReadonlyArray` 에 포함하는지 확인하는 `elem` 함수를 좀전에 만든 `Eq` 인스턴스를 사용해 구현해봅시다.

```typescript
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'

// 만약 `a` 가 `as` 리스트에 포함되면 `true` 를 반환합니다
const elem = <A>(E: Eq<A>) => (a: A) => (as: ReadonlyArray<A>): boolean =>
  as.some((e) => E.equals(a, e))

pipe([1, 2, 3], elem(N.Eq)(2), console.log) // => true
pipe([1, 2, 3], elem(N.Eq)(4), console.log) // => false
```

왜 내장 `includes` 배열 메소드를 사용하지 않을까요?

```typescript
console.log([1, 2, 3].includes(2)) // => true
console.log([1, 2, 3].includes(4)) // => false
```

`Eq` 인스턴스를 더 복잡한 타입에 대해 정의해봅시다.

```typescript
import { Eq } from 'fp-ts/Eq'

type Point = {
  readonly x: number
  readonly y: number
}

const EqPoint: Eq<Point> = {
  equals: (first, second) => first.x === second.x && first.y === second.y
}

console.log(EqPoint.equals({ x: 1, y: 2 }, { x: 1, y: 2 })) // => true
console.log(EqPoint.equals({ x: 1, y: 2 }, { x: 1, y: -2 })) // => false
```

그리고 `elem` 과 `includes` 의 결과를 확인해봅시다.

```typescript
const points: ReadonlyArray<Point> = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 }
]

const search: Point = { x: 1, y: 1 }

console.log(points.includes(search)) // => false :(
console.log(pipe(points, elem(EqPoint)(search))) // => true :)
```

**문제** (JavaScript). 왜 `includes` 메소드의 결과는 `false` 일까요?

사용자가 정의한 동등성 검사로직을 위한 유용한 API 가 없는 Javascript 같은 언어에서는 동등성의 개념을 추상화하는게 가장 중요합니다.

JavaScript 내장 `Set` 자료구조도 같은 이슈가 발생합니다:

```typescript
type Point = {
  readonly x: number
  readonly y: number
}

const points: Set<Point> = new Set([{ x: 0, y: 0 }])

points.add({ x: 0, y: 0 })

console.log(points)
// => Set { { x: 0, y: 0 }, { x: 0, y: 0 } }
```

`Set` 은 값 비교를 위해 `===` ("엄격한 비교") 를 하기에, `points` 는 두개의 동일한 복사본인 `{ x: 0, y: 0 }` 을 가지며 이는 우리는 원하는 결과가 아닙니다. 따라서 `Set` 에 요소를 추가하는 새로운 API 를 정의하는게 유용하며 그 방법 중 하나가 `Eq` 추상화를 활용하는 것입니다.

**문제**. 이 API 의 시그니쳐는 어떻게 될까요?
**문제**. What would be the signature of this API?

`EqPoint` 를 정의하는데 많은 boilerplate 코드가 필요할까요? 좋은 소식은 각각의 필드의 `Eq` 인스턴스를 정의할 수 있다면 `Point` 같은 구조체의 인스턴스도 정의할 수 있습니다.

`fp-ts/Eq` 모듈은 유용한 `struct` combinator 을 제공합니다:

```typescript
import { Eq, struct } from 'fp-ts/Eq'
import * as N from 'fp-ts/number'

type Point = {
  readonly x: number
  readonly y: number
}

const EqPoint: Eq<Point> = struct({
  x: N.Eq,
  y: N.Eq
})
```

**참고**. Semigroup 처럼, `구조체` 같은 데이터 타입에만 적용할 수 있는것은 아닙니다. tuple 에 적용되는 combinator 도 제공합니다: `tuple`

```typescript
import { Eq, tuple } from 'fp-ts/Eq'
import * as N from 'fp-ts/number'

type Point = readonly [number, number]

const EqPoint: Eq<Point> = tuple(N.Eq, N.Eq)

console.log(EqPoint.equals([1, 2], [1, 2])) // => true
console.log(EqPoint.equals([1, 2], [1, -2])) // => false
```

`fp-ts` 에는 다른 combinator 들이 존재하며, 여기 `ReadonlyArray` 에 대한 `Eq` 인스턴스를 만들어주는 combinator 를 볼 수 있습니다.

```typescript
import { Eq, tuple } from 'fp-ts/Eq'
import * as N from 'fp-ts/number'
import * as RA from 'fp-ts/ReadonlyArray'

type Point = readonly [number, number]

const EqPoint: Eq<Point> = tuple(N.Eq, N.Eq)

const EqPoints: Eq<ReadonlyArray<Point>> = RA.getEq(EqPoint)
```

Semigroups 처럼, 동일한 주어진 타입에 대한 하나 이상의 `Eq` 인스턴스를 만들 수 있습니다. 다음과 같은 `User` 모델이 있다고 가정해봅시다:

```typescript
type User = {
  readonly id: number
  readonly name: string
}
```

`struct` combinator 를 활용해 "표준" `Eq<User>` 인스턴스를 만들 수 있습니다:

```typescript
import { Eq, struct } from 'fp-ts/Eq'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

type User = {
  readonly id: number
  readonly name: string
}

const EqStandard: Eq<User> = struct({
  id: N.Eq,
  name: S.Eq
})
```

Haskell 같은 더 순수한 함수형 언어에서는 데이터 타입에 따라 두개 이상의 `Eq` 인스턴스를 만드는 것을 허용하지 않습니다. 하지만 문맥에 따라 `User` 의 동등성의 의미가 달라질 수 있습니다. 흔한 예는 `id` 필드가 같다면 두 `User` 는 같다고 보는 것입니다.

```typescript
/** `id` 필드가 동일하면 두 user 는 동일하다 */
const EqID: Eq<User> = {
  equals: (first, second) => N.Eq.equals(first.id, second.id)
}
```

추상 개념을 구체적인 데이터 구조로 표현했으므로, 다른 일반적은 데이터 구조에 하듯 `Eq` 인스턴스를 프로그래밍적으로 다룰 수 있습니다. 예제를 살벼봅시다.

**예제**. 직접 `EqId` 을 정의하는 대신, `contramap` combinator 를 활용할 수 있습니다: `Eq<A>` 인스턴스와 `B` 에서 `A` 로 가는 함수가 주어지면, `Eq<B>` 를 만들 수 있습니다

```typescript
import { Eq, struct, contramap } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

type User = {
  readonly id: number
  readonly name: string
}

const EqStandard: Eq<User> = struct({
  id: N.Eq,
  name: S.Eq
})

const EqID: Eq<User> = pipe(
  N.Eq,
  contramap((user: User) => user.id)
)

console.log(
  EqStandard.equals({ id: 1, name: 'Giulio' }, { id: 1, name: 'Giulio Canti' })
) // => false (`name` 필드가 다르기 때문에)

console.log(
  EqID.equals({ id: 1, name: 'Giulio' }, { id: 1, name: 'Giulio Canti' })
) // => true (`name` 필드가 다를 지라도)

console.log(EqID.equals({ id: 1, name: 'Giulio' }, { id: 2, name: 'Giulio' }))
// => false (`name` 필드가 동일할 지라도)
```

**문제**. 주어진 데이터 타입 `A` 에 대해, `Semigroup<Eq<A>>` 을 정의할 수 있을까요? 정의할 수 있다면 무엇을 의미하는 걸까요?
