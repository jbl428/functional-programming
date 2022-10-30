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

위 예제는 함수의 _확장적_ 정의라고 불리며, 이는 정의역의 요소들을 꺼내 그것들 각각에 대해 공역의 원소에 대응하는 것을 의미합니다. 

당연하게도, 이러한 집합이 무한이라면 문제가 발생한다는 것을 알 수 있습니다. 모든 함수의 정의역과 공역을 나열할 수 없기 때문입니다.

이 문제는 _조건적_ 정의라고 불리는 것을 통해 해결할 수 있습니다. 예를들면 `(x, y) ∈ f` 인 모든 순서쌍에 대해 `y = x * 2` 가 만족한다는 조건을 표현하는 것입니다.

TypeScript 에서 다음과 같은 익숙한 형태인 `double` 함수의 정의를 볼 수 있습니다:

```typescript
const double = (x: number): number => x * 2
```

곱집합의 부분집합으로서의 함수의 정의는 수작적으로 어떻게 모든 함수가 순수한지 보여줍니다: 어떠한 작용도, 상태 변경과 요소의 수정도 없습니다.
함수형 프로그래밍에서 함수의 구현은 가능한 한 이상적인 모델을 따라야합니다.

**문제**. 다음 절차(procedure) 중 순수 함수는 무엇일까요?

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

함수가 순수하다는 것이 꼭 **지역변수의 변경** (local mutability)을 금지한다는 의미는 아닙니다. 변수가 함수 범위를 벗어나지 않는다면 변경할 수 있습니다.

![mutable / immutable](../images/mutable-immutable.jpg)

**예제** (monoid 용 `concatALl` 함수 구현)

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

궁극적인 목적은 **참조 투명성** 을 만족하는 것입니다.

우리의 API 사용자와의 계약은 API 의 signature 와 참조 투명성을 준수하겠다는 약속에 의해 정의됩니다.

```typescript
declare const concatAll: <A>(M: Monoid<A>) => (as: ReadonlyArray<A>) => A
```

함수가 구현되는 방법에 대한 기술적 세부 사항은 관련이 없으므로, 구현 측면에서 많은 자유를 누릴 수 있습니다.

그렇다면, 우리는 부작용을 어떻게 정의해야 할까요? 단순히 참조 투명성 정의의 반대가 됩니다:

> 어떤 표현식이 참조 투명성을 지키지 않는다면 "부작용" 을 가지고 있습니다

함수는 함수형 프로그래밍의 두 가지 요소 중 하나인 참조 투명성의 완벽한 예시일 뿐만 아니라, 두 번째 요소한 **합성** 의 예시이기도 합니다.

함수 합성:

**정의**. 두 함수 `f: Y ⟶ Z` 와 `g: X ⟶ Y` 에 대해, 함수 `h: X ⟶ Z` 는 다음과 같이 정의된다:

```
h(x) = f(g(x))
```

이는 `f` 와 `g` 의 _합성_ 이라하며 `h = f ∘ g` 라고 쓴다.

`f` 와 `g` 를 합성하려면, `f` 의 정의역이 `g` 의 공역에 포함되어야 한다는 점에 유의하시기 바랍니다.

**정의**. 정의역의 하나 이상의 값에 대해 정의되지 않는 함수는 _부분함수_ 라고 합니다.

반대로, 정의역의 모든 원소에 대해 정의된 함수는 _전체함수_ 라고 합니다.

**예제**

```
f(x) = 1 / x
```

함수 `f: number ⟶ number` 는 `x = 0` 에 대해서는 정의되지 않습니다.

**예제**

```typescript
// `ReadonlyArray` 의 첫 번째 요소를 얻습니다
declare const head: <A>(as: ReadonlyArray<A>) => A
```

**문제**. 왜 `head` 는 부분함수 인가요?

**문제**. `JSON.parse` 는 전체함수 일까요?

```typescript
parse: (text: string, reviver?: (this: any, key: string, value: any) => any) =>
  any
```

**문제**. `JSON.stringify` 는 전체함수 일까요?

```typescript
stringify: (
  value: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
) => string
```

함수형 프로그래밍에서는 **순수 및 전체함수** 만 정의하는 경향이 있습니다. 지금부터 함수라는 용어는 "순수하면서 전체함수" 를 의미합니다. 그렇다면 애플리케이션에 부분함수가 있다면 어떻게 해야 할까요?

부분함수 `f: X ⟶ Y` 는 특별한 값(`None` 이라 부르겠습니다)을 공역에 더함으로써 언제나 전체함수로 되돌릴 수 있습니다.
정의되지 않은 모든 `X` 의 값을 `None` 에 대응하면 됩니다.

```
f': X ⟶ Y ∪ None
```

`Y ∪ None` 는 `Option(Y)` 와 동일하다고 정의한다면

```
f': X ⟶ Option(Y)
```

TypeScript 에서 `Option` 을 정의할 수 있을까요? 다음 장에서 그 방법을 살펴보겠습니다.
