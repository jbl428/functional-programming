## Dual Ordering

이전 챕터에서 `concat` 연산자를 반전시켜 `dual semigroup` 을 얻는 `reverse` combinator 를 만든것처럼, `compare` 연산자를 반전시켜 dual ordering 을 얻을 수 있습니다.

`Ord` 에 대한 `reserve` combinator 를 만들어봅시다:

```typescript
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { fromCompare, Ord } from 'fp-ts/Ord'

export const reverse = <A>(O: Ord<A>): Ord<A> =>
  fromCompare((first, second) => O.compare(second, first))
```

`reverse` 활용 예로 `min` 을 반전시켜 `max` 를 얻을 수 있습니다:

```typescript
import { flow, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { Ord, reverse } from 'fp-ts/Ord'

const min = <A>(O: Ord<A>) => (second: A) => (first: A): A =>
  O.compare(first, second) === 1 ? second : first

// const max: <A>(O: Ord<A>) => (second: A) => (first: A) => A
const max = flow(reverse, min)

pipe(2, max(N.Ord)(1), console.log) // => 2
```

**전순서** (모든 `x`, `y` 에 대해 다음 조건이 만족합니다: `x <= y` 이거나 `y <= z`)는 숫자에 대해선 명백하게 만족하는 것으로 보이지만, 모든 상황에서 그런것은 아닙니다. 조금 더 복잡한 상황을 가정해봅시다:

```typescript
type User = {
  readonly name: string
  readonly age: number
}
```

어떤 `User` 가 다른 `User` 보다 "작거나 같다"고 말하긴 어렵습니다.

어떻게 `Ord<User>` 인스턴스를 만들 수 있을까요?

문맥에 따라 다르지만, `User` 의 나이로 순서를 매기는 방법이 있습니다:

```typescript
import * as N from 'fp-ts/number'
import { fromCompare, Ord } from 'fp-ts/Ord'

type User = {
  readonly name: string
  readonly age: number
}

const byAge: Ord<User> = fromCompare((first, second) =>
  N.Ord.compare(first.age, second.age)
)
```

이번에도 `contramap` combinator 를 사용하면 `Ord<A>` 와 `B` 에서 `A` 로 가는 함수만 제공해 `Ord<B>` 를 만들 수 있으며 이를통해 작성하는 코드의 양을 줄일 수 있습니다:

```typescript
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { contramap, Ord } from 'fp-ts/Ord'

type User = {
  readonly name: string
  readonly age: number
}

const byAge: Ord<User> = pipe(
  N.Ord,
  contramap((_: User) => _.age)
)
```

이전에 정의한 `min` 함수를 사용해 주어진 두 `User` 중 더 젊은 `User` 를 얻을 수 있습니다.

```typescript
// const getYounger: (second: User) => (first: User) => User
const getYounger = min(byAge)

pipe(
  { name: 'Guido', age: 50 },
  getYounger({ name: 'Giulio', age: 47 }),
  console.log
) // => { name: 'Giulio', age: 47 }
```

**문제**. `fp-ts/ReadonlyMap` 모듈에는 다음과 같은 API 가 있습니다:

```typescript
/**
 * `ReadonlyMap` 의 키들이 정렬된 `ReadonlyArray` 를 얻습니다.
 * Get a sorted `ReadonlyArray` of the keys contained in a `ReadonlyMap`.
 */
declare const keys: <K>(
  O: Ord<K>
) => <A>(m: ReadonlyMap<K, A>) => ReadonlyArray<K>
```

왜 이 API 는 `Ord<K>` 인스턴스가 필요할까요?

이전에 만난 첫 문제상황으로 돌아가봅시다: `number` 가 아닌 다른 타입에 대한 다음 두 semigroup 을 정의하는 것입니다 `SemigroupMin` 과 `SemigroupMax`:

```typescript
import { Semigroup } from 'fp-ts/Semigroup'

const SemigroupMin: Semigroup<number> = {
  concat: (first, second) => Math.min(first, second)
}

const SemigroupMax: Semigroup<number> = {
  concat: (first, second) => Math.max(first, second)
}
```

이제 `Ord` 추상화가 있기에 문제를 해결할 수 있습니다:

```typescript
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { Ord, contramap } from 'fp-ts/Ord'
import { Semigroup } from 'fp-ts/Semigroup'

export const min = <A>(O: Ord<A>): Semigroup<A> => ({
  concat: (first, second) => (O.compare(first, second) === 1 ? second : first)
})

export const max = <A>(O: Ord<A>): Semigroup<A> => ({
  concat: (first, second) => (O.compare(first, second) === 1 ? first : second)
})

type User = {
  readonly name: string
  readonly age: number
}

const byAge: Ord<User> = pipe(
  N.Ord,
  contramap((_: User) => _.age)
)

console.log(
  min(byAge).concat({ name: 'Guido', age: 50 }, { name: 'Giulio', age: 47 })
) // => { name: 'Giulio', age: 47 }
console.log(
  max(byAge).concat({ name: 'Guido', age: 50 }, { name: 'Giulio', age: 47 })
) // => { name: 'Guido', age: 50 }
```

**예제**

다음 예제를 통해 지금까지 배운내용을 정리해봅시다 ([Fantas, Eel, and Specification 4: Semigroup](http://www.tomharding.me/2017/03/13/fantas-eel-and-specification-4/)에서 차용함).

데이터베이스에 다음과 같은 형태의 고객의 기록이 있는 시스템을 구축하는 상황을 가정해봅시다:

```typescript
interface Customer {
  readonly name: string
  readonly favouriteThings: ReadonlyArray<string>
  readonly registeredAt: number // 유닉스 시간
  readonly lastUpdatedAt: number // 유닉스 시간
  readonly hasMadePurchase: boolean
}
```

어떤 이유에서인지, 같은 사람에 대한 중복 데이터가 존재할 수 있습니다.

병합 전략이 필요한 순간입니다. 하지만 우리에겐 Semigroup 있습니다!

```typescript
import * as B from 'fp-ts/boolean'
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { contramap } from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import { max, min, Semigroup, struct } from 'fp-ts/Semigroup'
import * as S from 'fp-ts/string'

interface Customer {
  readonly name: string
  readonly favouriteThings: ReadonlyArray<string>
  readonly registeredAt: number // 유닉스 시간
  readonly lastUpdatedAt: number // 유닉스 시간
  readonly hasMadePurchase: boolean
}

const SemigroupCustomer: Semigroup<Customer> = struct({
  // 더 긴 이름을 선택 
  name: max(pipe(N.Ord, contramap(S.size))),
  // 모두 병합
  favouriteThings: RA.getSemigroup<string>(),
  // 가장 과거 일자를 선택
  registeredAt: min(N.Ord),
  // 가장 최근 일자를 선택
  lastUpdatedAt: max(N.Ord),
  // 논리합에 대한 boolean semigroup 
  hasMadePurchase: B.SemigroupAny
})

console.log(
  SemigroupCustomer.concat(
    {
      name: 'Giulio',
      favouriteThings: ['math', 'climbing'],
      registeredAt: new Date(2018, 1, 20).getTime(),
      lastUpdatedAt: new Date(2018, 2, 18).getTime(),
      hasMadePurchase: false
    },
    {
      name: 'Giulio Canti',
      favouriteThings: ['functional programming'],
      registeredAt: new Date(2018, 1, 22).getTime(),
      lastUpdatedAt: new Date(2018, 2, 9).getTime(),
      hasMadePurchase: true
    }
  )
)
/*
{ name: 'Giulio Canti',
  favouriteThings: [ 'math', 'climbing', 'functional programming' ],
  registeredAt: 1519081200000, // new Date(2018, 1, 20).getTime()
  lastUpdatedAt: 1521327600000, // new Date(2018, 2, 18).getTime()
  hasMadePurchase: true
}
*/
```

**문제**. 주어진 타입 `A` 에 대해 `Semigroup<Ord<A>>` 인스턴스를 만들 수 있나요? 가능하다면 무엇을 의미할까요?
