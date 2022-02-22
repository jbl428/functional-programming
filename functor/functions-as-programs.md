## 프로그램으로서의 함수

만약 함수로 프로그램을 모델링하고 싶다면 다음과 같은 문제를 해결해야합니다:

> 어떻게 순수함수로 부작용을 발생시키는 프로그램을 모델링 할 수 있는가?

정답은 **효과 (effects)** 를 통해 부작용을 모델링하는 것인데, 이는 부작용을 **표현** 하는 수단으로 생각할 수 있습니다.

JavaScript 에서 가능한 두 가지 기술을 살펴보겠습니다:

- 효과를 위한 DSL (domain specific language) 을 정의
- _thunk_ 를 사용

DSL 을 사용하는 첫 번째 방법은 다음과 같은 프로그램을

```typescript
function log(message: string): void {
  console.log(message) // side effect
}
```

아래와 부작용에 대한 **설명** 을 반환하는 함수로 수정해 공역을 변경하는 것입니다:

```typescript
type DSL = ... // 시스템이 처리할 수 있는 모든 effect 의 합타입

function log(message: string): DSL {
  return {
    type: "log",
    message
  }
}
```

**문제**. 새롭게 정의한 `log` 함수는 정말로 순수한가요? `log('foo') !== log('foo')` 임을 유의해주세요!

This technique requires a way to combine effects and the definition of an interpreter able to execute the side effects when launching the final program.

The second technique, way simpler in TypeScript, is to enclose the computation in a _thunk_:

```typescript
// a thunk representing a synchronous side effect
type IO<A> = () => A

const log = (message: string): IO<void> => {
  return () => console.log(message) // returns a thunk
}
```

The `log` program, once executed, won't cause immediately a side effect, but returns **a value representing the computation** (also known as _action_).

```typescript
import { IO } from 'fp-ts/IO'

export const log = (message: string): IO<void> => {
  return () => console.log(message) // returns a thunk
}

export const main = log('hello!')
// there's nothing in the output at this point
// because `main` is only an inert value
// representing the computation

main()
// only when launching the program I will see the result
```

In functional programming there's a tendency to shove side effects (under the form of effects) to the border of the system (the `main` function) where they are executed by an interpreter obtaining the following schema:

> system = pure core + imperative shell

In _purely functional_ languages (like Haskell, PureScript or Elm) this division is strict and clear and imposed by the very languages.

Even with this thunk technique (the same technique used in `fp-ts`) we need a way to combine effects, which brings us back to our goal of composing programs in a generic way, let's see how.

We first need a bit of (informal) terminology: we'll call **pure program** a function with the following signature:

```typescript
(a: A) => B
```

Such a signature models a program that takes an input of type `A` and returns a result of type `B` without any effect.

**Example**

The `len` program:

```typescript
const len = (s: string): number => s.length
```

We'll call an **effectful program** a function with the following signature:

```typescript
(a: A) => F<B>
```

Such a signature models a program that takes an input of type `A` and returns a result of type `B` together with an **effect** `F`, where `F` is some sort of type constructor.

Let's recall that a [type constructor](https://en.wikipedia.org/wiki/Type_constructor) is an `n`-ary type operator that takes as argument one or more types and returns another type. We have seen examples of such constructors as `Option`, `ReadonlyArray`, `Either`.

**Example**

The `head` program:

```typescript
import { Option, some, none } from 'fp-ts/Option'

const head = <A>(as: ReadonlyArray<A>): Option<A> =>
  as.length === 0 ? none : some(as[0])
```

is a program with an `Option` effect.

When we talk about effects we are interested in `n`-ary type constructors where `n >= 1`, example given:

| Type constructor   | Effect (interpretation)                        |
| ------------------ | ---------------------------------------------- |
| `ReadonlyArray<A>` | a non deterministic computation                |
| `Option<A>`        | a computation that may fail                    |
| `Either<E, A>`     | a computation that may fail                    |
| `IO<A>`            | a synchronous computation that **never fails** |
| `Task<A>`          | an asynchronous computation **never fails**    |
| `Reader<R, A>`     | reading from an environment                    |

where

```typescript
// a thunk returning a `Promise`
type Task<A> = () => Promise<A>
```

```typescript
// `R` represents an "environment" needed for the computation
// (we can "read" from it) and `A` is the result
type Reader<R, A> = (r: R) => A
```

Let's get back to our core problem:

> How do we compose two generic functions `f: (a: A) => B` e `g: (c: C) => D`?

With our current set of rules this general problem is not solvable. We need to add some _boundaries_ to `B` and `C`.

We already know that if `B = C` then the solution is the usual function composition.

```typescript
function flow<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a))
}
```

But what about other cases?
