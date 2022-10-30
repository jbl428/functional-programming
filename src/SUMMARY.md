# 목차

* [소개](README.md)

* [함수형 프로그래밍이란](what-is-fp/README.md)

* [함수형 프로그래밍의 두 가지 요소](two-pillar-of-fp/README.md)
    * [참조 투명성](two-pillar-of-fp/referential-transparency.md)
    * [합성](two-pillar-of-fp/composition.md)

* [Semigroup 으로 합성 모델링](semigroup-modeling/README.md)
    * [Magma 의 정의](semigroup-modeling/magma.md)
    * [Semigroup 의 정의](semigroup-modeling/semigroup.md)
    * [concatAll 함수](semigroup-modeling/concat-all.md)
    * [Dual semigroup](semigroup-modeling/dual-semigroup.md)
    * [Semigroup product](semigroup-modeling/semigroup-product.md)
    * [임의의 타입에 대한 semigroup 인스턴스 찾기](semigroup-modeling/find-semigroup.md)
    * [Order-derivable Semigroups](semigroup-modeling/order-derivable-semigroup.md)

* [`Eq` 를 활용한 동등성 모델링](eq-modeling/README.md)

* [`Ord` 를 활용한 순서 관계 모델링](ord-modeling/README.md)
    * [Dual Ordering](ord-modeling/dual-ordering.md)

* [`Monoid` 를 활용한 합성 모델링](monoid-modeling/README.md)
    * [concatAll 함수](monoid-modeling/concat-all.md)
    * [product monoid](monoid-modeling/product-monoid.md)

* [순수함수와 부분함수](pure-and-partial-functions/README.md)

* [대수적 자료형](algebraic-data-types/README.md)
    * [정의](algebraic-data-types/adt.md)
    * [곱타입](algebraic-data-types/product-types.md)
    * [합타입](algebraic-data-types/sum-types.md)

* [함수적 오류 처리](functional-error-handling/README.md)
    * [Option 타입](functional-error-handling/option.md)
    * [Eq 인스턴스](functional-error-handling/eq.md)
    * [Semigroup, Monoid 인스턴스](functional-error-handling/semigroup-monoid.md)
    * [Either 타입](functional-error-handling/either.md)

* [Category theory](category-theory/README.md)
    * [정의](category-theory/definition.md)
    * [프로그래밍 언어 모델링](category-theory/modeling-programming-languages.md)
    * [TypeScript](category-theory/typescript.md)
    * [합성의 핵심 문제](category-theory/composition-core-problem.md)

* [Functor](functor/README.md)
    * [프로그램으로서의 함수](functor/functions-as-programs.md)
    * [Functor 의 경계](functor/boundary-of-functor.md)
    * [정의](functor/definition.md)
    * [오류 처리](functor/error-handling.md)
    * [합성](functor/compose.md)
    * [contravariant functor](functor/contravariant-functor.md)
    * [fp-ts 에서의 functor](functor/functor-in-fp-ts.md)
    * [일반적인 문제 해결](functor/solve-general-problem.md)

* [Applicative Functor](applicative-functor/README.md)
    * [Currying](applicative-functor/Currying.md)
    * [ap 연산](applicative-functor/ap.md)
    * [of 연산](applicative-functor/of.md)
    * [합성](applicative-functor/compose.md)
    * [문제 해결](applicative-functor/solve-general-problem.md)

* [Monad](monad/README.md)
    * [중첩된 context 문제](monad/nested-context-problem.md)
    * [정의](monad/definition.md)
    * [Kleisli Category](monad/kleisli-category.md)
    * [단계별 chain 정의](monad/defining-chain.md)
    * [프로그램 다루기](monad/manipulating-program.md)
