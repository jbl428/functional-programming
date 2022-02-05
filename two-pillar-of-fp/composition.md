## 합성

함수형 프로그래밍의 기본 패턴은 합성입니다: 특정한 작업을 수행하는 작은 단위의 코드를 합성해 크고 복잡한 단위로 구성합니다.

"가장 작은것에서 가장 큰것으로" 합성하는 패턴의 예로 다음과 같은 것이 있습니다:

- 두 개 이상의 기본타입 값을 합성 (숫자나 문자열)
- 두 개 이상의 함수를 합성
- 전체 프로그램의 합성

마지막 예는 _모듈화 프로그래밍_ 이라 할 수 있습니다:

> 모듈화 프로그래밍이란 더 작은 프로그램을 붙여 큰 프로그램을 만드는 과정을 의미한다 - Simon Peyton Jones

이러한 프로그래밍 스타일은 combinator 를 통해 이루어집니다.

여기서 combinator 는 [combinator pattern](https://wiki.haskell.org/Combinator) 에서 말하는 용어입니다.

> 사물들을 조합한다는 개념을 중심으로 하여 라이브러리를 만드는 방법. 보통 어떤 타입 `T`와 `T`의 기본값들, 그리고 `T`의 값들을 다양한 방법으로 조합해 더 복잡한 값을 만든는 "combinator" 가 있습니다.
>
> (원문) A style of organizing libraries centered around the idea of combining things. Usually there is some type `T`, some "primitive" values of type `T`, and some "combinators" which can combine values of type `T` in various ways to build up more complex values of type `T`

combinator 의 일반적인 개념은 다소 모호하고 다른 형태로 나타날 수 있지만, 가장 간단한 것은 다음과 같다:

```typescript
combinator: Thing -> Thing
```

**예제**. `double` 함수는 두 수를 조합합니다.

combinator 의 목적은 이미 정의된 *어떤 것*으로 부터 새로운 *어떤 것*을 만드는 것입니다.

combinator 의 출력인 새로운 *어떤 것*은 다른 프로그램이나 combinator 로 전달할 수 있기 때문에, 우리는 조합적 폭발을 얻을 수 있으며 이는 이 패턴이 매우 강력하다는 것을 의미합니다.
> (원문) Since the output of a combinator, the new _Thing_, can be passed around as input to other programs and combinators, we obtain a combinatorial explosion of opportunities, which makes this pattern extremely powerful.

**예제**

```typescript
import { pipe } from 'fp-ts/function'

const double = (n: number): number => n * 2

console.log(pipe(2, double, double, double)) // => 16
```

따라서 함수형 모듈에서 다음과 같은 일반적인 형태를 볼 수 있습니다:

- 타입 `T`에 대한 model
- 타입 `T`의 "primitives"
- primitives 를 더 큰 구조로 조합하기 위한 combinators

이와 같은 모듈을 만들어봅시다.

**데모**

[`01_retry.ts`](../src/01_retry.ts)

위 데모를 통해 알 수 있듯이, 3개의 primitive 와 2 개의 combinator 만으로도 꽤 복잡한 정책을 표현할 수 있었습니다.

만약 새로운 primitive 나 combinator 를 기존것들과 조합한다면 표현가능한 경우의 수가 기하급수적으로 증가하는 것을 알 수 있습니다.

`01_retry.ts`에 있는 두 개의 combinator 에서 특히 중요한 함수는 `concat`인데 강력한 함수형 프로그래밍 추상화인 semigroup 과 관련있기 때문입니다.
