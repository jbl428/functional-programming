## Product monoid

As we have already seen with semigroups, it is possible to define a monoid instance for a `struct` if we are able to define a monoid instance for each of its fields.

**Example**

```typescript
import { Monoid, struct } from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'

type Point = {
  readonly x: number
  readonly y: number
}

const Monoid: Monoid<Point> = struct({
  x: N.MonoidSum,
  y: N.MonoidSum
})
```

**참고**. There is a combinator similar to `struct` that works with tuples: `tuple`.

```typescript
import { Monoid, tuple } from 'fp-ts/Monoid'
import * as N from 'fp-ts/number'

type Point = readonly [number, number]

const Monoid: Monoid<Point> = tuple(N.MonoidSum, N.MonoidSum)
```

**Quiz**. Is it possible to define a "free monoid" for a generic type `A`?

**Demo** (implementing a system to draw geoetric shapes on canvas)

[`03_shapes.ts`](../src/03_shapes.ts)
