## `Ord` 를 활용한 순서 관계 모델링

이전 `Eq` 챕터에서 **동등**의 개념을 다루었습니다. 이번에는 **순서**에 대한 개념을 다루고자 합니다.

전순서 관계는 Typescript 로 다음과 같이 구현할 수 있습니다:

```typescript
import { Eq } from 'fp-ts/lib/Eq'

type Ordering = -1 | 0 | 1

interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering
}
```

결과적으로:

- `x < y` if and only if `compare(x, y) = -1`
- `x = y` if and only if `compare(x, y) = 0`
- `x > y` if and only if `compare(x, y) = 1`

> `if and only if` 는 주어진 두 명제가 필요충분조건이라는 뜻입니다

**Example**

`number` 타입에 대한 `Ord` 인스턴스를 만들어봅시다:

```typescript
import { Ord } from 'fp-ts/Ord'

const OrdNumber: Ord<number> = {
  equals: (first, second) => first === second,
  compare: (first, second) => (first < second ? -1 : first > second ? 1 : 0)
}
```

다음과 같은 조건을 만족합니다:

1. **반사적**: `A` 의 모든 `x` 에 대해 `compare(x, x) <= 0` 이다
2. **반대칭적**: `A` 의 모든 `x`, `y` 에 대해 만약 `compare(x, y) <= 0` 이고 `compare(y, x) <= 0` 이면 `x = y` 이다
3. **추이적**: `A` 의 모든 `x`, `y`, `z` 에 대해 만약 `compare(x, y) <= 0` 이고 `compare(y, z) <= 0` 이면 `compare(x, z) <= 0` 이다

`Eq` 의 `equals` 연산자는 `compare` 연산자와도 호환됩니다:

`A` 의 모든 `x`, `y` 에 대해 다음 두 명제는 필요충분조건입니다

`compare(x, y) === 0` if and only if `equals(x, y) === true`

**Note**. `equals` 는 `compare` 를 활용해 다음 방법으로 도출할 수 있습니다:

```typescript
equals: (first, second) => compare(first, second) === 0
```

사실 `fp-ts/Ord` 모듈에 있는 `fromComapre` 하는 경우 `compare` 함수만 제공하면 `Ord` 인스턴스를 만들어줍니다:

```typescript
import { Ord, fromCompare } from 'fp-ts/Ord'

const OrdNumber: Ord<number> = fromCompare((first, second) =>
  first < second ? -1 : first > second ? 1 : 0
)
```

**문제**. 가위바위보 게임에 대한 `Ord` 인스턴스를 정의할 수 있을까요? `move1 <= move2` 이면 `move2` 가 `move1` 를 이깁니다.

`ReadonlyArray` 요소의 정렬을 위한 `sort` 함수를 만들어보면서 `Ord` 인스턴스의 실용적인 사용법을 확인해봅시다.

```typescript
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { Ord } from 'fp-ts/Ord'

export const sort = <A>(O: Ord<A>) => (
  as: ReadonlyArray<A>
): ReadonlyArray<A> => as.slice().sort(O.compare)

pipe([3, 1, 2], sort(N.Ord), console.log) // => [1, 2, 3]
```

**문제** (JavaScript). 왜 `sort` 구현에서 내장 배열 메소드 `slice` 를 사용한걸까요?

주어진 두 값중 작은것을 반환하는 `min` 함수를 만들어보면서 또 다른 `Ord` 활용법을 살펴봅시다:

```typescript
import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { Ord } from 'fp-ts/Ord'

const min = <A>(O: Ord<A>) => (second: A) => (first: A): A =>
  O.compare(first, second) === 1 ? second : first

pipe(2, min(N.Ord)(1), console.log) // => 1
```
