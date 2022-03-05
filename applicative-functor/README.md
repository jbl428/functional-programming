# Applicative functors
 
Functor 섹션에서 effectful 프로그램 인 `f: (a: A) => F<B>` 와 순수함수 `g: (b: B) => C` 를 합성하기 위해 `g` 를 `map(g): (fb: F<B>) => F<C>` 처럼 변형시킨 과정을 살펴보았습니다. (`F` 는 functor 인스턴스)

| 프로그램 f    | 프로그램 g       | 합성           |
|-----------|--------------|--------------|
| pure      | pure         | `g ∘ f`      |
| effectful | pure (unary) | `map(g) ∘ f` |

하지만 `g` 는 한 개의 파라미터를 받는 unary 함수이어야 합니다. 만약 `g` 가 두 개를 받는다면 어떻게 될까요? 여전히 functor 인스턴스만 가지고 `g` 를 변형할 수 있을까요?
