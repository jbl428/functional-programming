## 합성의 핵심 문제

_TS_ category 에서 다음 두 개의 일반적인 함수를 합성할 수 있습니다. `f: (a: A) => B` 와 `g: (c: C) => D`, 여기서 `C = B`

```typescript
function flow<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C {
  return (a) => g(f(a))
}

function pipe<A, B, C>(a: A, f: (a: A) => B, g: (b: B) => C): C {
  return flow(f, g)(a)
}
```

하지만 `B != C` 인 경우에는 어떻게 될까요? 어떻게 그러한 두 함수를 합성할 수 있을까요? 포기해야 할까요?

다음 장에서, 어떠한 조건에서 두 함수의 합성이 가능한지 살펴보겠습니다.

**스포일러**

- `f: (a: A) => B` 와 `g: (b: B) => C` 의 합성은 일반적인 함수의 합성을 사용합니다 we use our usual function composition
- `f: (a: A) => F<B>` 와 `g: (b: B) => C` 의 합성은 `F` 의 **functor** 인스턴스가 필요합니다
- `f: (a: A) => F<B>` 와 `g: (b: B, c: C) => D` 의 합성은 `F` 의 **applicative functor** 인스턴스가 필요합니다
- `f: (a: A) => F<B>` 와 `g: (b: B) => F<C>` 의 합성은 `F` 의 **monad** 인스턴스가 필요합니다

<img src="/images/spoiler.png" width="900" alt="The four composition recipes" />

이번 장의 초반에 언급한 문제가 두 번째 상황에 해당하며 `F` 는 `Option` 타입을 의미합니다:

```typescript
// A = ReadonlyArray<number>, B = number, F = Option
head: (as: ReadonlyArray<number>) => Option<number>
double: (n: number) => number
```

문제를 해결하기 위해, 다음 장에서 functor 에 대해 알아봅시다.
