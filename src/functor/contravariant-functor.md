## Contravariant Functors

사실 이전 장에서 우리는 정의를 완전히 철저히 따지지 않았습니다. 이전 장에서 "functor" 는 **covariant (공변) functor** 라고 부르는게 적절합니다.

이번 장에서 우리는 또 다른 functor 인 **contravariant (반변)** functor 를 살펴보려 합니다.

contravariant functor 의 정의는 기본 연산의 시그니쳐를 제외하면 covariant 와 거의 동일합니다. 해당 연산은 `map` 보다는 `contramap` 으로 불립니다.

<img src="../images/contramap.png" width="300" alt="contramap" />

**예제**

```typescript
import { map } from 'fp-ts/Option'
import { contramap } from 'fp-ts/Eq'

type User = {
  readonly id: number
  readonly name: string
}

const getId = (_: User): number => _.id

//`map` 이 동작하는 방식입니다
// const getIdOption: (fa: Option<User>) => Option<number>
const getIdOption = map(getId)

// `contramap` 이 동작하는 방식입니다
// const getIdEq: (fa: Eq<number>) => Eq<User>
const getIdEq = contramap(getId)

import * as N from 'fp-ts/number'

const EqID = getIdEq(N.Eq)

/*

이전 `Eq` 챕터에서 확인한 내용입니다:

const EqID: Eq<User> = pipe(
  N.Eq,
  contramap((_: User) => _.id)
)
*/
```
