## Functor 합성

Functor 합성이란, 주어진 두 개의 functor `F` 와 `G` 를 합성한 `F<G<A>>` 를 말하며 이 또한 functor 입니다. 여기서 합성한 functor 의 `map` 함수는 각 functor 의 `map` 함수의 합성입니다.

**예제** (`F = Task`, `G = Option`)

```typescript
import { flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'

type TaskOption<A> = T.Task<O.Option<A>>

export const map: <A, B>(
  f: (a: A) => B
) => (fa: TaskOption<A>) => TaskOption<B> = flow(O.map, T.map)

// -------------------
// 사용 예제
// -------------------

interface User {
  readonly id: number
  readonly name: string
}

// 더미 원격 데이터베이스
const database: Record<number, User> = {
  1: { id: 1, name: 'Ruth R. Gonzalez' },
  2: { id: 2, name: 'Terry R. Emerson' },
  3: { id: 3, name: 'Marsha J. Joslyn' }
}

const getUser = (id: number): TaskOption<User> => () =>
  Promise.resolve(O.fromNullable(database[id]))
const getName = (user: User): string => user.name

// getUserName: number -> TaskOption<string>
const getUserName = flow(getUser, map(getName))

getUserName(1)().then(console.log) // => some('Ruth R. Gonzalez')
getUserName(4)().then(console.log) // => none
```
