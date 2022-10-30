## Category 로 구현한 TypeScript

TypeScript 언어를 단순화한 _TS_ 라고 불리는 category 를 정의해봅시다:

- **object** 는 TypeScript 의 타입입니다: `string`, `number`, `ReadonlyArray<string>`, 등...
- **morphism** 은 TypeScript 함수입니다: `(a: A) => B`, `(b: B) => C`, ... 여기서 `A`, `B`, `C`, ... 는 TypeScript 의 타입
- **identity morphism** 은 단일 다형 함수를 의미합니다 `const identity = <A>(a: A): A => a`
- **morphism 의 합성** 은 (결합법칙을 만족하는) 일반적인 함수의 합성입니다 

TypeScript 모델 _TS_ category 는 다소 제한적으로 보일 수 있습니다: 반목문도 없고, `if` 문도 없으며, _대부분_ 기능이 없습니다... 하지만 잘 정의된 합성의 개념을 활용하면 이 모델은 우리가 목표에 도달하는 데 도움이 될 만큼 충분히 풍부하다고 할 수 있습니다.
> (원문) As a model of TypeScript, the _TS_ category may seem a bit limited: no loops, no `if`s, there's _almost_ nothing... that being said that simplified model is rich enough to help us reach our goal: to reason about a well-defined notion of composition.
