## 프로그램으로서의 함수

만약 함수로 프로그램을 모델링하고 싶다면 다음과 같은 문제를 해결해야합니다:

> 어떻게 순수함수로 부작용을 발생시키는 프로그램을 모델링 할 수 있는가?

정답은 **효과 (effects)** 를 통해 부작용을 모델링하는 것인데, 이는 부작용을 **표현** 하는 수단으로 생각할 수 있습니다.

JavaScript 에서 가능한 두 가지 기법을 살펴보겠습니다:

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

이 기법은 effect 와 최종 프로그램을 시작할 때 부작용을 실행할 수 있는 인터프리터의 정의를 결합하는 방법이 필요합니다.

TypeScript 에서는 더 간단한 방법인 두 번째 기법은, 계산작업을 _thunk_ 로 감싸는 것입니다:

```typescript
// 비동기적인 부작용을 의미하는 thunk
type IO<A> = () => A

const log = (message: string): IO<void> => {
  return () => console.log(message) // thunk 를 반환합니다
}
```

`log` 함수는 호출 시에는 부작용을 발생시키진 않지만, (_action_ 이라 불리는) **계산작업을 나타내는 값** 을 반환합니다.

```typescript
import { IO } from 'fp-ts/IO'

export const log = (message: string): IO<void> => {
  return () => console.log(message) // thunk 를 반환합니다
}

export const main = log('hello!')
// 이 시점에서는 로그를 출력하지 않습니다
// 왜냐하면 `main` 은 단지 계산작업을 나타내는 비활성 값이기 때문입니다.

main()
// 프로그램을 실행시킬 때 결과를 확인할 수 있습니다
```


함수형 프로그래밍에서는 (effect 의 형태를 가진) 부작용을 (`main` 함수로 불리는) 시스템의 경계에 밀어넣는 경향이 있습니다. 즉 시스템은 다음과 같은 형태를 가지며 인터프리터에 의해 실행됩니다.

> system = pure core + imperative shell

(Haskell, PureScript 또는 Elm 과 같은) _순수 함수형_ 언어들은 언어 자체가 위 내용을 엄격하고 명확하게 지킬것을 요구합니다.
> (원문) In _purely functional_ languages (like Haskell, PureScript or Elm) this division is strict and clear and imposed by the very languages.

(`fp-ts` 에서 사용된) 이 thunk 기법또한 effect 를 결합할 수 있는 방법이 필요한데, 이는 일반적인 방법으로 프로그램을 합성하는 법을 찾아야 함을 의미합니다.

그 전에 우선 (비공식적인) 용어가 필요합니다: 다음 시그니쳐를 가진 함수를 **순수 프로그램** 이라 합시다:

```typescript
(a: A) => B
```

이러한 시그니처는 `A` 타입의 입력을 받아 `B` 타입의 결과를 아무런 effect 없이 반환하는 프로그램을 의미합니다.

**예제**

`len` 프로그램:

```typescript
const len = (s: string): number => s.length
```

이제 다음 시그니쳐를 가진 함수를 **effectful 프로그램** 이라 합시다:

```typescript
(a: A) => F<B>
```

이러한 시그니쳐는 `A` 타입의 입력을 받아 `B` 타입과 **effect** `F` 를 함께 반환하는 프로그램을 의미합니다. 여기서 `F` 는 일종의 type constructor 입니다.

[type constructor](https://en.wikipedia.org/wiki/Type_constructor) 는 `n` 개의 타입 연산자로 하나 이상의 타입을 받아 또 다른 타입을 반환합니다. 이전에 본 `Option`, `ReadonlyArray`, `Either` 와 같은 것이 type constructor 에 해당합니다.

**예제**

`head` 프로그램:

```typescript
import { Option, some, none } from 'fp-ts/Option'

const head = <A>(as: ReadonlyArray<A>): Option<A> =>
  as.length === 0 ? none : some(as[0])
```

이 프로그램은 `Option` effect 를 가집니다.

effect 를 다루다보면 다음과 같은 `n` 개의 타입을 받는 type constructor 를 살펴봐야 합니다. 

| Type constructor   | Effect (interpretation) |
|--------------------|:------------------------|
| `ReadonlyArray<A>` | 비 결정적 계산작업              |
| `Option<A>`        | 실패할 수 있는 계산작업           |
| `Either<E, A>`     | 실패할 수 있는 계산작업           |
| `IO<A>`            | **절대 실패하지 않는** 동기 계산작업  |
| `Task<A>`          | **절대 실패하지 않는** 비동기 계잔작업 |
| `Reader<R, A>`     | 외부 환경의 값 읽기             |

여기서

```typescript
// `Promise` 를 반환하는 thunk
type Task<A> = () => Promise<A>
```

```typescript
// `R` 은 계산에 필요한 "environment" 를 의미합니다
// 그 값을 읽을 수 있으며 `A` 를 결과로 반환합니다
type Reader<R, A> = (r: R) => A
```

이전의 핵심 문제로 돌아가봅시다:

> 어떻게 두 일반적인 함수 `f: (a: A) => B` 와 `g: (c: C) => D` 를 합성할 수 있을까요?

지금까지 알아본 규칙으로는 이 일반적인 문제를 해결할 수 없습니다. 우리는 `B` 와 `C` 에 약간의 _경계_ 를 추가해야 합니다.

`B = C` 의 경우에는 일반적인 함수 합성으로 해결할 수 있음을 알고 있습니다.

```typescript
function flow<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a))
}
```

하지만 다른 경우에는 어떻게 해야할까요?
