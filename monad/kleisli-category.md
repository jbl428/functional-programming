## The Kleisli category

<center>
<img src="/images/kleisli.jpg" width="300" alt="Heinrich Kleisli" />

(Heinrich Kleisli, Swiss mathematician)

</center>

Let's try building a category _K_ (called **Kleisli category**) which contains _only_ Kleisli arrows:

- **objects** will be the same objects of the _TS_ category, so all TypeScript types.
- **morphisms** are built like this: every time there is a Kleisli arrow `f: A ⟼ M<B>` in _TS_ we draw an arrow `f': A ⟼ B` in _K_

<center>
<img src="/images/kleisli_category.png" alt="above the TS category, below the K construction" width="400px" />

(above the composition in the _TS_ category, below the composition in the _K_ construction)

</center>

So what would be the composition of `f` and `g` in _K_?
It's th red arrow called `h'` in the image below:

<center>
<img src="/images/kleisli_composition.png" alt="above the composition in the TS category, below the composition in the K construction" width="400px" />

(above the composition in the _TS_ category, below the composition in the _K_ construction)

</center>

Given that `h'` is an arrow from `A` to `C` in `K`, we can find a corresponding function `h` from `A` to `M<C>` in `TS`.

Thus, a good candidate for the following composition of `f` and `g` in _TS_ is still a Kleisli arrow with the following signature: `(a: A) => M<C>`.

Let's try implementing such a function.
