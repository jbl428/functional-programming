### The `Option` type

The type `Option` represents the effect of a computation which may fail (case `None`) or return a type `A` (case `Some<A>`):

```typescript
// represents a failure
interface None {
  readonly _tag: 'None'
}

// represents a success
interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

type Option<A> = None | Some<A>
```

Constructors and pattern matching:

```typescript
const none: Option<never> = { _tag: 'None' }

const some = <A>(value: A): Option<A> => ({ _tag: 'Some', value })

const match = <R, A>(onNone: () => R, onSome: (a: A) => R) => (
  fa: Option<A>
): R => {
  switch (fa._tag) {
    case 'None':
      return onNone()
    case 'Some':
      return onSome(fa.value)
  }
}
```

The `Option` type can be used to avoid throwing exceptions or representing the optional values, thus we can move from:

```typescript
//                        this is a lie ↓
const head = <A>(as: ReadonlyArray<A>): A => {
  if (as.length === 0) {
    throw new Error('Empty array')
  }
  return as[0]
}

let s: string
try {
  s = String(head([]))
} catch (e) {
  s = e.message
}
```

where the type system is ignorant about the possibility of failure, to:

```typescript
import { pipe } from 'fp-ts/function'

//                                      ↓ the type system "knows" that this computation may fail
const head = <A>(as: ReadonlyArray<A>): Option<A> =>
  as.length === 0 ? none : some(as[0])

declare const numbers: ReadonlyArray<number>

const result = pipe(
  head(numbers),
  match(
    () => 'Empty array',
    (n) => String(n)
  )
)
```

where **the possibility of an error is encoded in the type system**.

If we attempt to access the `value` property of an `Option` without checking in which case we are, the type system will warn us about the possibility of getting an error:

```typescript
declare const numbers: ReadonlyArray<number>

const result = head(numbers)
result.value // type checker error: Property 'value' does not exist on type 'Option<number>'
```

The only way to access the value contained in an `Option` is to handle also the failure case using the `match` function.

```typescript
pipe(result, match(
  () => ...handle error...
  (n) => ...go on with my business logic...
))
```

Is it possible to define instances for the abstractions we've seen in the chapters before? Let's begin with `Eq`.
