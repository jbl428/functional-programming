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

### 생성자

`n` 개의 요소를 가진 합타입은 각 멤버에 대해 하나씩 최소 `n` 개의 **생성자** 가 필요합니다:

**예제** (redux action creators)

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

**예제** (TypeScript, 연결 리스트)

```typescript
export type List<A> =
  | { readonly _tag: 'Nil' }
  | { readonly _tag: 'Cons'; readonly head: A; readonly tail: List<A> }

// null 생성자는 상수로 구현할 수 있습니다
export const nil: List<never> = { _tag: 'Nil' }

export const cons = <A>(head: A, tail: List<A>): List<A> => ({
  _tag: 'Cons',
  head,
  tail
})

// 다음 배열과 동일합니다 [1, 2, 3]
const myList = cons(1, cons(2, cons(3, nil)))
```

### Pattern matching

JavaScript 는 [pattern matching](https://github.com/tc39/proposal-pattern-matching) 을 지원하지 않습니다 (TypeScript 도 마찬가지입니다) 하지만 `match` 함수로 시뮬레이션 할 수 있습니다.

**예제** (TypeScript, 연결 리스트)

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

// 리스트가 비어있다면 `true` 를 반환합니다
export const isEmpty = match(
  () => true,
  () => false
)

// 리스트의 첫 번째 요소를 반환하거나 없다면 `undefined` 를 반환합니다
export const head = match(
  () => undefined,
  (head, _tail) => head
)

// 재귀적으로, 리스트의 길이를 계산해 반환합니다
export const length: <A>(fa: List<A>) => number = match(
  () => 0,
  (_, tail) => 1 + length(tail)
)
```

**문제**. `head` 가 최적의 API 가 아닌 이유는 무엇일까요?

**참고**. TypeScript 는 합타입에 대한 유용한 기능을 제공합니다: **exhaustive check**. Type checker 는 함수 본문에 정의된 `switch` 가 모든 경우에 대해 처리하고 있는지 _검증_ 할 수 있습니다.

### 왜 "합"타입 이라 하는가?

왜냐하면 다음 항등식이 성립하기 때문입니다:

```typescript
C(A | B) = C(A) + C(B)
```

> 합의 cardinality 는 각 cardinality 들의 합과 같습니다

**예제** (`Option` 타입)

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

일반적인 공식인 `C(Option<A>) = 1 + C(A)` 를 통해, `Option<boolean>` 의 cardinality 를 계산할 수 있습니다: `1 + 2 = 3` 개의 멤버를 가집니다.

### 언제 합타입을 써야하나요?

곱타입으로 구현된 각 요소가 **의존적** 일 때입니다.

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
      // 오류: onChange 가 'undefined' 일 수 있어서 호출할 수 없습니다 :(
      this.props.onChange('a')
    }
    return <div />
  }
}
```

문제는 `Props` 가 곱타입으로 모델링되었지만, `onChange` 는 `editable` 에 **의존** 하는 것입니다.

이 경우에는 합타입이 더 유용합니다:

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

**예제** (node callbacks)

```typescript
declare function readFile(
  path: string,
  //         ↓ ---------- ↓ CallbackArgs
  callback: (err?: Error, data?: string) => void
): void
```

`readFile` 의 연산 결과는 `callback` 함수를 통해 전달되는 곱타입처럼 모델링됩니다 (정확히 말하면, tuple):

```typescript
type CallbackArgs = [Error | undefined, string | undefined]
```

callback 요소들은 서로 **의존적** 입니다: `Error` 를 얻거나 **또는** `string` 를 얻습니다:

| err         | data        | legal? |
| ----------- | ----------- | ------ |
| `Error`     | `undefined` | ✓      |
| `undefined` | `string`    | ✓      |
| `Error`     | `string`    | ✘      |
| `undefined` | `undefined` | ✘      |

이 API 는 다음과 같은 전제하에 모델링되지 않았습니다:

> 불가능한 상태를 나타낼 수 없게합니다

합타입이 더 좋은 선택입니다만, 어떤 합타입을 써야할까요?
이후 오류를 함수적인 방법으로 처리하는 방법을 다룰것입니다.

**문제**. 최근 callback 기반 API 들은 상당 부분 `Promise` 로 대체되고 있습니다.

```typescript
declare function readFile(path: string): Promise<string>
```

TypeScript 같은 정적 타입 언어에서 Promise 를 사용할 때의 단점을 찾을 수 있나요?
