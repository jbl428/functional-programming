## Monad Definition

**Definition**. A monad is defined by three things:

(1) a type constructor `M` admitting a functor instance

(2) a function `of` (also called **pure** or **return**) with the following signature:

```typescript
of: <A>(a: A) => M<A>
```

(3) a `chain` function (also called **flatMap** or **bind**) with the following signature:

```typescript
chain: <A, B>(f: (a: A) => M<B>) => (ma: M<A>) => M<B>
```

The `of` and `chain` functions need to obey three laws:

- `chain(of) ∘ f = f` (**Left identity**)
- `chain(f) ∘ of = f` (**Right identity**)
- `chain(h) ∘ (chain(g) ∘ f) = chain((chain(h) ∘ g)) ∘ f` (**Associativity**)

where `f`, `g`, `h` are all effectful functions and `∘` is the usual function composition.

When I saw this definition for the first time I had many questions:

- why exactly those two operation `of` and `chain`? and why to they have those signatures?
- why do they have those synonyms like "pure" or "flatMap"?
- why does laws need to hold true? What do they mean?
- if `flatten` is so important for monads, why it doesn't compare in its definition?

This chapter will try to answer all of these questions.

Let's get back to the core problem: what is the composition of two effectful functions `f` and `g`?

<img src="/images/kleisli_arrows.png" alt="two Kleisli arrows, what's their composition?" width="450px" />

<center>(two Kleisli Arrows)</center>

**참고**. An effectful function is also called **Kleisli arrow**.

For the time being I don't even know the **type** of such composition.

But we've already seen some abstractions that talks specifically about composition. Do you remember what we said about categories?

> Categories capture the essence of composition

We can transform our problem into a category problem, meaning: can we find a category that models the composition of Kleisli arrows?
