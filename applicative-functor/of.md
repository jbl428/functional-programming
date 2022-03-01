## The `of` operation

Now we know that given two function `f: (a: A) => F<B>`, `g: (b: B, c: C) => D` we can obtain the composition `h`:

```typescript
h: (a: A) => (fb: F<B>) => F<D>
```

To execute `h` we need a new value of type `A` and a value of type `F<B>`.

But what happens if, instead of having a value of type `F<B>`, for the second parameter `fb` we only have a value of type `B`?

It would be helpful to have an operation which can transform a value of type `B` in a value of type `F<B>` in order to use `h`.

Let's introduce such operation, called `of` (other synonyms: **pure**, **return**):

```typescript
declare const of: <B>(b: B) => F<B>
```

In literature the term **applicative functors** is used for the type constructors which admith _both_ the `ap` and `of` operations.

Let's see how `of` is defined for some type constructors we've already seen:

**Example** (`F = ReadonlyArray`)

```typescript
const of = <A>(a: A): ReadonlyArray<A> => [a]
```

**Example** (`F = Option`)

```typescript
import * as O from 'fp-ts/Option'

const of = <A>(a: A): O.Option<A> => O.some(a)
```

**Example** (`F = IO`)

```typescript
import { IO } from 'fp-ts/IO'

const of = <A>(a: A): IO<A> => () => a
```

**Example** (`F = Task`)

```typescript
import { Task } from 'fp-ts/Task'

const of = <A>(a: A): Task<A> => () => Promise.resolve(a)
```

**Example** (`F = Reader`)

```typescript
import { Reader } from 'fp-ts/Reader'

const of = <R, A>(a: A): Reader<R, A> => () => a
```

**Demo**

[`05_applicative.ts`](src/05_applicative.ts)
