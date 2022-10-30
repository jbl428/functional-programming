### `Eq` 인스턴스

두 개의 `Option<string>` 타입을 가지고 있고 두 값이 동일한지 확인하고 싶다고 해봅시다:

```typescript
import { pipe } from 'fp-ts/function'
import { match, Option } from 'fp-ts/Option'

declare const o1: Option<string>
declare const o2: Option<string>

const result: boolean = pipe(
  o1,
  match(
    // o1 이 none 인 경우
    () =>
      pipe(
        o2,
        match(
          // o2 가 none 인 경우
          () => true,
          // o2 가 some 인 경우
          () => false
        )
      ),
    // o1 이 some 인 경우
    (s1) =>
      pipe(
        o2,
        match(
          // o2 가 none 인 경우
          () => false,
          // o2 가 some 인 경우
          (s2) => s1 === s2 // 여기서 엄격한 동등을 사용합니다
        )
      )
  )
)
```

만약 두 개의 `Option<number>` 가 있다면 어떻게 될까요? 아마 위와 비슷한 코드를 또 작성하는건 번거로울 것입니다. 결국 차이가 발생하는 부분은 `Option` 에 포함된 두 값을 비교하는 방법이라 할 수 있습니다.

따라서 사용자에게 `A` 에 대한 `Eq` 인스턴스를 받아 `Option<A>` 에 대한 `Eq` 인스턴스를 만드는 방법으로 일반화 할 수 있습니다.

다른 말로 하자면 우리는 `getEq` **combinator** 를 정의할 수 있습니다: 임의의 `Eq<A>` 를 받아 `Eq<Option<A>>` 를 반환합니다:

```typescript
import { Eq } from 'fp-ts/Eq'
import { pipe } from 'fp-ts/function'
import { match, Option, none, some } from 'fp-ts/Option'

export const getEq = <A>(E: Eq<A>): Eq<Option<A>> => ({
  equals: (first, second) =>
    pipe(
      first,
      match(
        () =>
          pipe(
            second,
            match(
              () => true,
              () => false
            )
          ),
        (a1) =>
          pipe(
            second,
            match(
              () => false,
              (a2) => E.equals(a1, a2) // 여기서 `A` 를 비교합니다
            )
          )
      )
    )
})

import * as S from 'fp-ts/string'

const EqOptionString = getEq(S.Eq)

console.log(EqOptionString.equals(none, none)) // => true
console.log(EqOptionString.equals(none, some('b'))) // => false
console.log(EqOptionString.equals(some('a'), none)) // => false
console.log(EqOptionString.equals(some('a'), some('b'))) // => false
console.log(EqOptionString.equals(some('a'), some('a'))) // => true
```

`Option<A>` 타입에 대한 `Eq` 인스턴스를 정의함으로 얻게되는 가장 좋은 점은 이전에 보았던 `Eq` 에 대한 모든 조합에 대해 응용할 수 있다는 점입니다.
> (원문) The best thing about being able to define an `Eq` instance for a type `Option<A>` is being able to leverage all of the combiners we've seen previously for `Eq`.

**예제**:

`Option<readonly [string, number]>` 타입에 대한 `Eq` 인스턴스:

```typescript
import { tuple } from 'fp-ts/Eq'
import * as N from 'fp-ts/number'
import { getEq, Option, some } from 'fp-ts/Option'
import * as S from 'fp-ts/string'

type MyTuple = readonly [string, number]

const EqMyTuple = tuple<MyTuple>(S.Eq, N.Eq)

const EqOptionMyTuple = getEq(EqMyTuple)

const o1: Option<MyTuple> = some(['a', 1])
const o2: Option<MyTuple> = some(['a', 2])
const o3: Option<MyTuple> = some(['b', 1])

console.log(EqOptionMyTuple.equals(o1, o1)) // => true
console.log(EqOptionMyTuple.equals(o1, o2)) // => false
console.log(EqOptionMyTuple.equals(o1, o3)) // => false
```

위 코드에서 import 부분만 살짝 바꾸면 `Ord` 에 대한 비슷한 결과를 얻을 수 있습니다:

```typescript
import * as N from 'fp-ts/number'
import { getOrd, Option, some } from 'fp-ts/Option'
import { tuple } from 'fp-ts/Ord'
import * as S from 'fp-ts/string'

type MyTuple = readonly [string, number]

const OrdMyTuple = tuple<MyTuple>(S.Ord, N.Ord)

const OrdOptionMyTuple = getOrd(OrdMyTuple)

const o1: Option<MyTuple> = some(['a', 1])
const o2: Option<MyTuple> = some(['a', 2])
const o3: Option<MyTuple> = some(['b', 1])

console.log(OrdOptionMyTuple.compare(o1, o1)) // => 0
console.log(OrdOptionMyTuple.compare(o1, o2)) // => -1
console.log(OrdOptionMyTuple.compare(o1, o3)) // => -1
```
