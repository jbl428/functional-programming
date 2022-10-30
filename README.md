# 소개

이 저장소는 Typescript 와 fp-ts 라이브러리를 활용해 함수형 프로그래밍을 소개합니다.

모든 내용은 [enricopolanski](https://github.com/enricopolanski/functional-programming) 의 저장소에서 나온 것입니다.

해당 저장소도 이탈리아어로 작성된 [Giulio Canti](https://gcanti.github.io/about.html) 의 ["Introduction to Functional Programming (Italian)"](https://github.com/gcanti/functional-programming) 을 영어로 번역한 것입니다.

원본 작성자는 해당 글을 함수형 프로그래밍에 관한 강의나 워크샵에 참고자료로 사용하였습니다.

개인적인 공부와 fp-ts 라이브러리 생태계를 소개하기 위한 목적으로 번역하였습니다.

오역 및 번역이 매끄럽지 않은 부분이 존재하며 특히 번역이 어려웠던 부분은 원글을 함께 표시하였습니다.

**Setup**

```sh
git clone https://github.com/jbl428/functional-programming.git
cd functional-programming
npm i
```

> 본 문서는 `Gitbook` 으로도 볼 수 있습니다.
> [GitBook Link](https://jbl428.gitbook.io/typescript-fp-ts)

* [함수형 프로그래밍이란](src/what-is-fp/README.md)

* [함수형 프로그래밍의 두 가지 요소](src/two-pillar-of-fp/README.md)
    * [참조 투명성](src/two-pillar-of-fp/referential-transparency.md)
    * [합성](src/two-pillar-of-fp/composition.md)

* [Semigroup 으로 합성 모델링](src/semigroup-modeling/README.md)
    * [Magma 의 정의](src/semigroup-modeling/magma.md)
    * [Semigroup 의 정의](src/semigroup-modeling/semigroup.md)
    * [concatAll 함수](src/semigroup-modeling/concat-all.md)
    * [Dual semigroup](src/semigroup-modeling/dual-semigroup.md)
    * [Semigroup product](src/semigroup-modeling/semigroup-product.md)
    * [임의의 타입에 대한 semigroup 인스턴스 찾기](src/semigroup-modeling/find-semigroup.md)
    * [Order-derivable Semigroups](src/semigroup-modeling/order-derivable-semigroup.md)

* [`Eq` 를 활용한 동등성 모델링](src/eq-modeling/README.md)

* [`Ord` 를 활용한 순서 관계 모델링](src/ord-modeling/README.md)
    * [Dual Ordering](src/ord-modeling/dual-ordering.md)

* [`Monoid` 를 활용한 합성 모델링](src/monoid-modeling/README.md)
    * [concatAll 함수](src/monoid-modeling/concat-all.md)
    * [product monoid](src/monoid-modeling/product-monoid.md)

* [순수함수와 부분함수](src/pure-and-partial-functions/README.md)

* [대수적 자료형](src/algebraic-data-types/README.md)
    * [정의](src/algebraic-data-types/adt.md)
    * [곱타입](src/algebraic-data-types/product-types.md)
    * [합타입](src/algebraic-data-types/sum-types.md)

* [함수적 오류 처리](src/functional-error-handling/README.md)
    * [Option 타입](src/functional-error-handling/option.md)
    * [Eq 인스턴스](src/functional-error-handling/eq.md)
    * [Semigroup, Monoid 인스턴스](src/functional-error-handling/semigroup-monoid.md)
    * [Either 타입](src/functional-error-handling/either.md)

* [Category theory](src/category-theory/README.md)
    * [정의](src/category-theory/definition.md)
    * [프로그래밍 언어 모델링](src/category-theory/modeling-programming-languages.md)
    * [TypeScript](src/category-theory/typescript.md)
    * [합성의 핵심 문제](src/category-theory/composition-core-problem.md)

* [Functor](src/functor/README.md)
    * [프로그램으로서의 함수](src/functor/functions-as-programs.md)
    * [Functor 의 경계](src/functor/boundary-of-functor.md)
    * [정의](src/functor/definition.md)
    * [오류 처리](src/functor/error-handling.md)
    * [합성](src/functor/compose.md)
    * [contravariant functor](src/functor/contravariant-functor.md)
    * [fp-ts 에서의 functor](src/functor/functor-in-fp-ts.md)
    * [일반적인 문제 해결](src/functor/solve-general-problem.md)

* [Applicative Functor](src/applicative-functor/README.md)
    * [Currying](src/applicative-functor/Currying.md)
    * [ap 연산](src/applicative-functor/ap.md)
    * [of 연산](src/applicative-functor/of.md)
    * [합성](src/applicative-functor/compose.md)
    * [문제 해결](src/applicative-functor/solve-general-problem.md)

* [Monad](src/monad/README.md)
    * [중첩된 context 문제](src/monad/nested-context-problem.md)
    * [정의](src/monad/definition.md)
    * [Kleisli Category](src/monad/kleisli-category.md)
    * [단계별 chain 정의](src/monad/defining-chain.md)
    * [프로그램 다루기](src/monad/manipulating-program.md)
