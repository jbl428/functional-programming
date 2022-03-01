## The problem with nested contexts

Let's see few examples on why we need something more.

**Example** (`F = Array`)

Suppose we want to get followers' followers.

```typescript
import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/ReadonlyArray'

interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const getFollowers = (user: User): ReadonlyArray<User> => user.followers

declare const user: User

// followersOfFollowers: ReadonlyArray<ReadonlyArray<User>>
const followersOfFollowers = pipe(user, getFollowers, A.map(getFollowers))
```

There's something wrong here, `followersOfFollowers` has a type `ReadonlyArray<ReadonlyArray<User>>` but we want `ReadonlyArray<User>`.

We need to **flatten** nested arrays.

The function `flatten: <A>(mma: ReadonlyArray<ReadonlyArray<A>>) => ReadonlyArray<A>` exported by the `fp-ts/ReadonlyArray` is exactly what we need:

```typescript
// followersOfFollowers: ReadonlyArray<User>
const followersOfFollowers = pipe(
  user,
  getFollowers,
  A.map(getFollowers),
  A.flatten
)
```

Cool! Let's see some other data type.

**Example** (`F = Option`)
Suppose you want to calculate the reciprocal of the first element of a numerical array:

```typescript
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'

const inverse = (n: number): O.Option<number> =>
  n === 0 ? O.none : O.some(1 / n)

// inverseHead: O.Option<O.Option<number>>
const inverseHead = pipe([1, 2, 3], A.head, O.map(inverse))
```

Oops, it happened again, `inverseHead` has type `Option<Option<number>>` but we want `Option<number>`.

We need to flatten again the nested `Option`s.

The `flatten: <A>(mma: Option<Option<A>>) => Option<A>` function exported by the `fp-ts/Option` module is what we need:

```typescript
// inverseHead: O.Option<number>
const inverseHead = pipe([1, 2, 3], A.head, O.map(inverse), O.flatten)
```

All of those `flatten` funcitons...They aren't a coincidence, there is a functional pattern behind the scenes: both the type constructors
`ReadonlyArray` and `Option` (and many others) admit a **monad instance** and

> `flatten` is the most peculiar operation of monads

**참고**. A common synonym of `flatten` is **join**.

So, what is a monad?

Here is how they are often presented...
