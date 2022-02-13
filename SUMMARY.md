# 목차

* [소개](README.md)

## 문서

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
 
* [범주론](category-theory/README.md)
    * [정의](category-theory/definition.md)
