## 합타입

합타입은 서로 다른 (하지만 제한적인) 유형의 값을 가질 수 있는 자료형입니다. 하나의 인스턴스는 이 유형 중 오직 하나에 속하며 보통 이들 유형을 구분하기 위한 "tag" 값이 존재합니다.

TypeScript 공식 문서에는 이들을 [discriminated union](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) 으로 부릅니다.

이 union 의 각 멤버들은 **disjoint(서로소)** 이어야 하며, 어떤 값이 두 개 이상의 멤버에 속할 수 없습니다.

**예제**

```typescript
type StringsOrNumbers = ReadonlyArray<string> | ReadonlyArray<number>

declare const sn: StringsOrNumbers

sn.map() // error: This expression is not callable.
```

위 타입은 두 멤버가 빈 배열을 의미하는 `[]` 를 포함하기 때문에 서로소가 아닙니다.

**문제**. 다음 조합은 서로소인가요? 

```typescript
type Member1 = { readonly a: string }
type Member2 = { readonly b: number }
type MyUnion = Member1 | Member2
```

서로소 조합은 함수형 프로그래밍에서 재귀적입니다.

다행히 `TypeScript` 는 조합이 서로소임을 보장할 수 있는 방법이 있습니다: **tag** 로 동작하는 필드를 추가하는 것입니다.

**참고**: 서로소 조합, 합타입 그리고 태그된 조합은 같은 의미로 사용됩니다.

**예제** (redux actions)

`Action` 합타입은 사용자가 [todo app](https://todomvc.com/) 에서 수행할 수 있는 작업의 일부를 모델링합니다.

```typescript
type Action =
  | {
      type: 'ADD_TODO'
      text: string
    }
  | {
      type: 'UPDATE_TODO'
      id: number
      text: string
      completed: boolean
    }
  | {
      type: 'DELETE_TODO'
      id: number
    }
```

`type` 태그가 각 멤버가 서로소임을 보장하게 해줍니다.

**참고**. 태그역할을 하는 필드이름은 개발자가 선택하는 것입니다. 꼭 "type" 일 필요는 없습니다. `fp-ts` 에서는, 보통 `_tag` 필드를 사용합니다.

몇 개의 예제를 보았으니 이제 대수적 자료형을 보다 명확하게 정의할 수 있습니다:

> 일반적으로, 대수적 자료형은 하나 이상의 독립적 요소들의 합이며, 여기서 각 요소는 0개 이상의 필드의 곱으로 이루어져 있다.

합타입은 다형적이고 재귀적일 수 있습니다.

**예제** (연결 리스트)

```typescript
//               ↓ 타입 파라미터
export type List<A> =
  | { readonly _tag: 'Nil' }
  | { readonly _tag: 'Cons'; readonly head: A; readonly tail: List<A> }
//                                                              ↑ 재귀
```

**문제** (TypeScript). 다음 자료형들은 곱타입 인가요? 합타입 인가요?

- `ReadonlyArray<A>`
- `Record<string, A>`
- `Record<'k1' | 'k2', A>`
- `ReadonlyMap<string, A>`
- `ReadonlyMap<'k1' | 'k2', A>`

### Constructors

A sum type with `n` elements needs at least `n` **constructors**, one for each member:

**Example** (redux action creators)

```typescript
export type Action =
  | {
      readonly type: 'ADD_TODO'
      readonly text: string
    }
  | {
      readonly type: 'UPDATE_TODO'
      readonly id: number
      readonly text: string
      readonly completed: boolean
    }
  | {
      readonly type: 'DELETE_TODO'
      readonly id: number
    }

export const add = (text: string): Action => ({
  type: 'ADD_TODO',
  text
})

export const update = (
  id: number,
  text: string,
  completed: boolean
): Action => ({
  type: 'UPDATE_TODO',
  id,
  text,
  completed
})

export const del = (id: number): Action => ({
  type: 'DELETE_TODO',
  id
})
```

**Example** (TypeScript, linked lists)

```typescript
export type List<A> =
  | { readonly _tag: 'Nil' }
  | { readonly _tag: 'Cons'; readonly head: A; readonly tail: List<A> }

// a nullary constructor can be implemented as a constant
export const nil: List<never> = { _tag: 'Nil' }

export const cons = <A>(head: A, tail: List<A>): List<A> => ({
  _tag: 'Cons',
  head,
  tail
})

// equivalent to an array containing [1, 2, 3]
const myList = cons(1, cons(2, cons(3, nil)))
```

### Pattern matching

JavaScript doesn't support [pattern matching](https://github.com/tc39/proposal-pattern-matching) (neither does TypeScript) but we can simulate it with a `match` function.

**Example** (TypeScript, linked lists)

```typescript
interface Nil {
  readonly _tag: 'Nil'
}

interface Cons<A> {
  readonly _tag: 'Cons'
  readonly head: A
  readonly tail: List<A>
}

export type List<A> = Nil | Cons<A>

export const match = <R, A>(
  onNil: () => R,
  onCons: (head: A, tail: List<A>) => R
) => (fa: List<A>): R => {
  switch (fa._tag) {
    case 'Nil':
      return onNil()
    case 'Cons':
      return onCons(fa.head, fa.tail)
  }
}

// returns `true` if the list is empty
export const isEmpty = match(
  () => true,
  () => false
)

// returns the first element of the list or `undefined`
export const head = match(
  () => undefined,
  (head, _tail) => head
)

// returns the length of the the list, recursively
export const length: <A>(fa: List<A>) => number = match(
  () => 0,
  (_, tail) => 1 + length(tail)
)
```

**Quiz**. Why's the `head` API sub optimal?

**참고**. TypeScript offers a great feature for sum types: **exhaustive check**. The type checker can _check_, no pun intended, whether all the possible cases are handled by the `switch` defined in the body of the function.

### Why "sum" types?

Because the following identity holds true:

```typescript
C(A | B) = C(A) + C(B)
```

> The sum of the cardinality is the sum of the cardinalities

**Example** (the `Option` type)

```typescript
interface None {
  readonly _tag: 'None'
}

interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

type Option<A> = None | Some<A>
```

From the general formula `C(Option<A>) = 1 + C(A)` we can derive the cardinality of the `Option<boolean>` type: `1 + 2 = 3` members.

### When should I use a sum type?

When the components would be **dependent** if implemented with a product type.

**Example** (`React` props)

```typescript
import * as React from 'react'

interface Props {
  readonly editable: boolean
  readonly onChange?: (text: string) => void
}

class Textbox extends React.Component<Props> {
  render() {
    if (this.props.editable) {
      // error: Cannot invoke an object which is possibly 'undefined' :(
      this.props.onChange('a')
    }
    return <div />
  }
}
```

The problem here is that `Props` is modeled like a product, but `onChange` **depends** on `editable`.

A sum type fits the use case better:

```typescript
import * as React from 'react'

type Props =
  | {
      readonly type: 'READONLY'
    }
  | {
      readonly type: 'EDITABLE'
      readonly onChange: (text: string) => void
    }

class Textbox extends React.Component<Props> {
  render() {
    switch (this.props.type) {
      case 'EDITABLE':
        this.props.onChange('a') // :)
    }
    return <div />
  }
}
```

**Example** (node callbacks)

```typescript
declare function readFile(
  path: string,
  //         ↓ ---------- ↓ CallbackArgs
  callback: (err?: Error, data?: string) => void
): void
```

The result of the `readFile` operation is modeled like a product type (to be more precise, as a tuple) which is later on passed to the `callback` function:

```typescript
type CallbackArgs = [Error | undefined, string | undefined]
```

the callback components though are **dependent**: we either get an `Error` **or** a `string`:

| err         | data        | legal? |
| ----------- | ----------- | ------ |
| `Error`     | `undefined` | ✓      |
| `undefined` | `string`    | ✓      |
| `Error`     | `string`    | ✘      |
| `undefined` | `undefined` | ✘      |

This API is clarly not modeled on the following premise:

> Make impossible state unrepresentable

A sum type would've been a better choice, but which sum type?
We'll see how to handle errors in a functional way.

**Quiz**. Recently API's based on callbacks have been largely replaced by their `Promise` equivalents.

```typescript
declare function readFile(path: string): Promise<string>
```

Can you find some cons of the Promise solution when using static typing like in TypeScript?
