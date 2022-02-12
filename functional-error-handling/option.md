### `Option` 타입

`Option` 타입은 실패하거나 (`None` 의 경우) `A` 타입을 반환하는 (`Some` 의 경우) 계산의 효과를 표현합니다.

```typescript
// 실패를 표현합니다
interface None {
  readonly _tag: 'None'
}

// 성공을 표현합니다
interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}

type Option<A> = None | Some<A>
```

생성자와 패턴 매칭은 다음과 같습니다:

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

`Option` 타입은 오류를 던지는 것을 방지하거나 선택적인 값을 표현하는데 사용할 수 있습니다, 따라서 다음과 같은 코드를 개선할 수 있습니다:

```typescript
//                           거짓말 입니다 ↓
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

위 타입 시스템은 실패의 가능성을 무시하고 있습니다.

```typescript
import { pipe } from 'fp-ts/function'

//                                      ↓ 타입 시스템은 계산이 실패할 수 있음을 "표현"합니다
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

위 예제는 **에러 발생 가능성이 타입 시스템에 들어있습니다**.

만약 `Option` 의 `value` 값을 검증없이 접근하는 경우, 타입 시스템이 오류의 가능성을 알려줍니다:

```typescript
declare const numbers: ReadonlyArray<number>

const result = head(numbers)
result.value // type checker 오류: 'value' 프로퍼티가 'Option<number>' 에 존재하지 않습니다
```

`Option` 에 들어있는 값을 접근할 수 있는 유일한 방법은 `match` 함수를 사용해 실패 상황도 같이 처리하는 것입니다.

```typescript
pipe(result, match(
  () => ...오류 처리...
(n) => ...이후 비즈니스 로직을 처리합니다...
))
```

이전 챕터에서 보았던 추상화에 대한 인스턴스틀 정의할 수 있을까요? `Eq` 부터 시작해봅시다.
