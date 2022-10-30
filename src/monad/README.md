# Monads

![Eugenio Moggi](../images/moggi.jpg)

(Eugenio Moggi 는 이탈리아 Genoa 대학교의 컴퓨터 공학 교수입니다. 그는 먼저 프로그램을 만들기 위한 monad 의 일반적인 사용법을 발견했습니다)

![Philip Lee Wadler](../images/wadler.jpg)

(Philip Lee Wadler 는 프로그래밍 언어 디자인과 타입 이론에 기여한 것으로 알려진 미국의 컴퓨터 과학자입니다)

이전 장에서 type constructor `F` 가 applicative functor 인스턴스를 가지는 경우에만 1 개 이상의 파라미터를 가지는 순수 프로그램 `g` 와 effectful 프로그램 `f: (a: A) => F<B>` 를 합성할 수 있음을 살펴보았습니다:

| 프로그램 f    | 프로그램 g        | 합성              |
|-----------|---------------|-----------------|
| pure      | pure          | `g ∘ f`         |
| effectful | pure (unary)  | `map(g) ∘ f`    |
| effectful | pure, `n`-ary | `liftAn(g) ∘ f` |

하지만 꽤 자주 발생하는 다음 상황에 대한 문제를 해결해야합니다. 두 프로그램 **모두** effectful 인 경우입니다:

```typescript
f: (a: A) => F<B>
g: (b: B) => F<C>
```

`f` 와 `g` 의 합성이란 무엇일까요?
