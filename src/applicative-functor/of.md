## `of` 연산

이제 다음 두 함수 `f: (a: A) => F<B>`, `g: (b: B, c: C) => D` 에서 다음 합성 `h` 을 얻을 수 있음을 보았습니다:

```typescript
h: (a: A) => (fb: F<B>) => F<D>
```

`h` 를 실행하기 위해 타입 `A` 의 값과 타입 `F<B>` 의 값이 필요합니다.

하지만 만약, 두 번째 파라미터 `fb` 를 위한 타입 `F<B>` 의 값 대신 `B` 만 가지고 있다면 어떡할까요?

`B` 를 `F<B>` 로 바꿔주는 연산이 있다면 유용할 것입니다.

이제 그러한 역할을 하는 `of` 로 불리는 연산을 소개합니다 (동의어: **pure**, **return**):

```typescript
declare const of: <B>(b: B) => F<B>
```

보통 `ap` 와 `of` 연산을 가지는 type constructor 에 대해서만 **applicative functors** 라는 용어를 사용합니다.

지금까지 살펴본 type constructor 에 대한 `of` 의 정의를 살펴봅시다:

**예제** (`F = ReadonlyArray`)

```typescript
const of = <A>(a: A): ReadonlyArray<A> => [a]
```

**예제** (`F = Option`)

```typescript
import * as O from 'fp-ts/Option'

const of = <A>(a: A): O.Option<A> => O.some(a)
```

**예제** (`F = IO`)

```typescript
import { IO } from 'fp-ts/IO'

const of = <A>(a: A): IO<A> => () => a
```

**예제** (`F = Task`)

```typescript
import { Task } from 'fp-ts/Task'

const of = <A>(a: A): Task<A> => () => Promise.resolve(a)
```

**예제** (`F = Reader`)

```typescript
import { Reader } from 'fp-ts/Reader'

const of = <R, A>(a: A): Reader<R, A> => () => a
```

**데모**

[`05_applicative.ts`](/05_applicative.ts)
