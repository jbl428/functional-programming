## 정의

functor 는 다음을 만족하는 쌍 `(F, map)` 입니다:

- `F` 는 한 개 이상의 파라미터를 가지는 type constructor 로 모든 타입 `X` 를 `F<X>` 로 매핑합니다 (**object 간의 매핑**) 
- `map` 은 다음 시그니쳐를 가진 함수입니다:

```typescript
map: <A, B>(f: (a: A) => B) => ((fa: F<A>) => F<B>)
```

이 함수는 모든 함수 `f: (a: A) => B` 를 `map(f): (fa: F<A>) => F<B>` 로 매핑합니다 (**morphism 간의 매핑**)

다음 두 성질을 만족해야 합니다:

- `map(1`X`)` = `1`F(X) (**항등원은 항등원으로 매핑됩니다**)
- `map(g ∘ f) = map(g) ∘ map(f)` (**합성의 상(image)는 상들의 합성과 동일합니다**)

두 번째 법칙은 다음과 같은 상황에서 계산을 최적화할 때 사용할 수 있습니다:

```typescript
import { flow, increment, pipe } from 'fp-ts/function'
import { map } from 'fp-ts/ReadonlyArray'

const double = (n: number): number => n * 2

// 배열을 두 번 순회합니다
console.log(pipe([1, 2, 3], map(double), map(increment))) // => [ 3, 5, 7 ]

// 배열을 한 번 순회합니다
console.log(pipe([1, 2, 3], map(flow(double, increment)))) // => [ 3, 5, 7 ]
```
