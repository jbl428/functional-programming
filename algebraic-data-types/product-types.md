## 곱타입

곱타입은 집합 `I` 로 색인된 타입 T<sub>i</sub> 의 목록입니다:

```typescript
type Tuple1 = [string] // I = [0]
type Tuple2 = [string, number] // I = [0, 1]
type Tuple3 = [string, number, boolean] // I = [0, 1, 2]

// Accessing by index
type Fst = Tuple2[0] // string
type Snd = Tuple2[1] // number
```

구조체의 경우, `I` 는 label 의 집합입니다:

```typescript
// I = {"name", "age"}
interface Person {
  name: string
  age: number
}

// label 을 통한 접근
type Name = Person['name'] // string
type Age = Person['age'] // number
```

곱타입은 **다형적(polymorphic)** 일 수 있습니다.

**예제**

```typescript
//                ↓ type parameter
type HttpResponse<A> = {
  readonly code: number
  readonly body: A
}
```

### 왜 "곱"타입 이라 하는가?

만약 `A` 의 요소의 개수를 `C(A)` 로 표기한다면 (수학에서는 **cardinality** 로 부릅니다), 다음 방적식은 참입니다:

```typescript
C([A, B]) = C(A) * C(B)
```

> 곱의 cardinality 는 각 cardinality 들의 곱과 같습니다

**예제**

`null` 타입의 cardinality 는 `1` 입니다. 왜냐하면 `null` 하나의 요소만 가지기 때문입니다.

**문제**: `boolean` 타입의 cardinality 는 어떻게 될까요?

**예제**

```typescript
type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type Period = 'AM' | 'PM'
type Clock = [Hour, Period]
```

`Hour` 타입은 12 개의 요소를 가지고 있습니다. has 12 members.
`Period` 타입은 2 개의 요소를 가지고 있습니다. has 2 members.
따라서 `Clock` 타입은 `12 * 2 = 24` 개의 요소를 가지고 있습니다.

**문제**: 다음 `Clock` 타입의 cardinality 는 무엇일까요?

```typescript
// 이전과 같음
type Hour = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
// 이전과 같음
type Period = 'AM' | 'PM'

// 형태만 다름, tuple 타입이 아님
type Clock = {
  readonly hour: Hour
  readonly period: Period
}
```

### 언제 곱타입을 쓸 수 있나요?

각 구성 요소가 **독립적** 이면 사용할 수 있습니다.

```typescript
type Clock = [Hour, Period]
```

여기서 `Hour` 와 `Period` 는 독립적입니다: `Hour` 값이 `Period` 의 값을 바꾸지 않습니다. 모든 가능한 쌍 `[Hour, Period]` 는 **이치** 에 맞고 올바릅니다.
