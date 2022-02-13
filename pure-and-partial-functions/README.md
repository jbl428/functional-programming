# 순수함수와 부분함수

첫 번째 챕터에서 순수함수에 대한 비공식적인 정의를 보았습니다:

> 순수함수란 같은 입력에 항상 같은 결과를 내는 관찰 가능한 부작용없는 절차입니다.

위와같은 비공식적 문구를 보고 다음과 같은 의문점이 생길 수 있습니다:

- "부작용"이란 무엇인가?
- "관찰가능하다"는 것은 무엇을 의미하는가?
- "같다"라는게 무엇을 의미하는가?

이 함수의 공식적인 정의를 살펴봅시다.

**참고**. 만약 `X` 와 `Y` 가 집합이면,  `X × Y` 은 _곱집합_ 이라 불리며 다음과 같은 집합을 의미합니다

```
X × Y = { (x, y) | x ∈ X, y ∈ Y }
```

다음 [정의](https://en.wikipedia.org/wiki/History_of_the_function_concept) 는 한 세기 전에 만들어졌습니다:

**정의**. 함수 `f: X ⟶ Y` 는 `X × Y` 의 부분집합이면서 다음 조건을 만족합니다,
모든 `x ∈ X` 에 대해 `(x, y) ∈ f` 를 만족하는 오직 하나의 `y ∈ Y` 가 존재합니다. 

집합 `X` 는 함수 `f` 의 _정의역_ 이라 하며, `Y` 는 `f` 의 _공역_ 이라 합니다.

**예제**

함수 `double: Nat ⟶ Nat` 곱집합 `Nat × Nat` 의 부분집합이며 형태는 다음과 같습니다: `{ (1, 2), (2, 4), (3, 6), ...}`

Typescript 에서는 `f` 를 다음과 같이 정의할 수 있습니다

```typescript
const f: Record<number, number> = {
  1: 2,
  2: 4,
  3: 6
  ...
}
```

<!--
TODO:
Please note that the set `f` has to be described _statically_ when defining the function (meaning that the elements of that set cannot change with time for no reason).
In this way we can exclude any form of side effect and the return value is always the same.
-->

The one in the example is called an _extensional_ definition of a function, meaning we enumerate one by one each of the elements of its domain and for each one of them we point the corresponding codomain element.

Naturally, when such a set is infinite this proves to be problematic. We can't list the entire domain and codomain of all functions.

We can get around this issue by introducing the one that is called _intensional_ definition, meaning that we express a condition that has to hold for every couple `(x, y) ∈ f` meaning `y = x * 2`.

This the familiar form in which we write the `double` function and its definition in TypeScript:

```typescript
const double = (x: number): number => x * 2
```

The definition of a function as a subset of a cartesian product shows how in mathematics every function is pure: there is no action, no state mutation or elements being modified.
In functional programming the implementation of functions has to follow as much as possible this ideal model.

**Quiz**. Which of the following procedures are pure functions?

```typescript
const coefficient1 = 2
export const f1 = (n: number) => n * coefficient1

// ------------------------------------------------------

let coefficient2 = 2
export const f2 = (n: number) => n * coefficient2++

// ------------------------------------------------------

let coefficient3 = 2
export const f3 = (n: number) => n * coefficient3

// ------------------------------------------------------

export const f4 = (n: number) => {
  const out = n * 2
  console.log(out)
  return out
}

// ------------------------------------------------------

interface User {
  readonly id: number
  readonly name: string
}

export declare const f5: (id: number) => Promise<User>

// ------------------------------------------------------

import * as fs from 'fs'

export const f6 = (path: string): string =>
  fs.readFileSync(path, { encoding: 'utf8' })

// ------------------------------------------------------

export const f7 = (
  path: string,
  callback: (err: Error | null, data: string) => void
): void => fs.readFile(path, { encoding: 'utf8' }, callback)
```

The fact that a function is pure does not imply automatically a ban on local mutability as long as it doesn't leaks out of its scope.

![mutable / immutable](/images/mutable-immutable.jpg)

**Example** (Implementazion details of the `concatAll` function for monoids)

```typescript
import { Monoid } from 'fp-ts/Monoid'

const concatAll = <A>(M: Monoid<A>) => (as: ReadonlyArray<A>): A => {
  let out: A = M.empty // <= local mutability
  for (const a of as) {
    out = M.concat(out, a)
  }
  return out
}
```

The ultimate goal is to guarantee: **referential transparency**.

The contract we sign with a user of our APIs is defined by the APIs signature:

```typescript
declare const concatAll: <A>(M: Monoid<A>) => (as: ReadonlyArray<A>) => A
```

and by the promise of respecting referential transparency. The technical details of how the function is implemented are not relevant, thus there is maximum freedom implementation-wise.

Thus, how do we define a "side effect"? Simply by negating referential transparency:

> An expression contains "side effects" if it doesn't benefit from referential transparency

Not only functions are a perfect example of one of the two pillars of functional programming, referential transparency, but they're also examples of the second pillar: **composition**.

Functions compose:

**Definition**. Given `f: Y ⟶ Z` and `g: X ⟶ Y` two functions, then the function `h: X ⟶ Z` defined by:

```
h(x) = f(g(x))
```

is called _composition_ of `f` and `g` and is written `h = f ∘ g`

Please note that in order for `f` and `g` to combine, the domain of `f` has to be included in the codomain of `g`.

**Definition**. A function is said to be _partial_ if it is not defined for each value of its domain.

Vice versa, a function defined for all values of its domain is said to be _total_

**Example**

```
f(x) = 1 / x
```

The function `f: number ⟶ number` is not defined for `x = 0`.

**Example**

```typescript
// Get the first element of a `ReadonlyArray`
declare const head: <A>(as: ReadonlyArray<A>) => A
```

**Quiz**. Why is the `head` function partial?

**Quiz**. Is `JSON.parse` a total function?

```typescript
parse: (text: string, reviver?: (this: any, key: string, value: any) => any) =>
  any
```

**Quiz**. Is `JSON.stringify` a total function?

```typescript
stringify: (
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
) => string
```

In functional programming there is a tendency to only define **pure and total functions**. From now one with the term function we'll be specifically referring to "pure and total function". So what do we do when we have a partial function in our applications?

A partial function `f: X ⟶ Y` can always be "brought back" to a total one by adding a special value, let's call it `None`, to the codomain and by assigning it to the output of `f` for every value of `X` where the function is not defined.

```
f': X ⟶ Y ∪ None
```

Let's call it `Option(Y) = Y ∪ None`.

```
f': X ⟶ Option(Y)
```

In functional programming the tendency is to define only pure and and total functions.

Is it possible to define `Option` in TypeScript? In the following chapters we'll see how to do it.
