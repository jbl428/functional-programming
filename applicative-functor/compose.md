## Applicative functors 합성

Applicative functors 합성이란, 두 applicative functor `F` 와 `G` 에 대해 `F<G<A>>` 또한 applicative functor 라는 것을 말합니다.

**예제** (`F = Task`, `G = Option`)

합성의 `of` 는 각 `of` 의 합성과 같습니다:

```typescript
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'

type TaskOption<A> = T.Task<O.Option<A>>

const of: <A>(a: A) => TaskOption<A> = flow(O.of, T.of)
```

합성의 `ap` 는 다음 패턴을 활용해 얻을 수 있습니다:

```typescript
const ap = <A>(
  fa: TaskOption<A>
): (<B>(fab: TaskOption<(a: A) => B>) => TaskOption<B>) =>
  flow(
    T.map((gab) => (ga: O.Option<A>) => O.ap(ga)(gab)),
    T.ap(fa)
  )
```
