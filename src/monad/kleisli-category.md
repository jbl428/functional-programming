## Kleisli category

![Heinrich Kleisli](/images/kleisli.jpg)

Kleisli arrow 로만 이루어진 (**Kleisli category** 로 불리는) category _K_ 를 만들어봅시다:

- **object** 는 _TS_ category 에서의 object 와 동일합니다, 즉 모든 TypeScript 타입입니다.
- **morphism** 은 다음 방식으로 만듭니다: _TS_ 에서의 모든 Kleisli arrow `f: A ⟼ M<B>` 는 _K_ 에서 `f': A ⟼ B` 로 매핑됩니다.

![위는 TS category, 아래는 K construction](/images/kleisli_category.png)

그렇다면 _K_ 에서 `f` 와 `g` 의 합성은 무엇일까요? 아래 아미지에서 `h'` 로 표시된 붉은 화살표입니다:

![위는 TS category 에서의 합성, 아래는 K construction 에서의 합성](/images/kleisli_composition.png)

`K` 에 속하는 `A` 에서 `C` 로 향하는 화살표 `h'` 가 주어지면, 그에 해당하는 _TS_ 에 속하는 `A` 에서 `M<C>` 로 향하는 함수 `h` 를 찾을 수 있습니다. 

따라서 _TS_ 에서 `f` 와 `g` 의 합성을 위한 좋은 후보는 다음 시그니처를 가진 Kleisli arrow 입니다: `(a: A) => M<C>`

이제 이러한 함수를 구현해봅시다.
