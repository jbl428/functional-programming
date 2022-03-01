# Monads

<center>
<img src="/images/moggi.jpg" width="300" alt="Eugenio Moggi" />

(Eugenio Moggi is a professor of computer science at the University of Genoa, Italy. He first described the general use of monads to structure programs)

<img src="/images/wadler.jpg" width="300" alt="Philip Lee Wadler" />

(Philip Lee Wadler is an American computer scientist known for his contributions to programming language design and type theory)

</center>

In the last chapter we have seen how we can compose an effectful program `f: (a: A) => F<B>` with an `n`-ary pure program `g`, if and only if the type constructor `F` admits an applicative functor instance:

| Program f | Program g     | Composition     |
| --------- | ------------- | --------------- |
| pure      | pure          | `g ∘ f`         |
| effectful | pure (unary)  | `map(g) ∘ f`    |
| effectful | pure, `n`-ary | `liftAn(g) ∘ f` |

But we need to solve one last, quite common, case: when **both** programs are effectful:

```typescript
f: (a: A) => F<B>
g: (b: B) => F<C>
```

What is the composition of `f` and `g`?
