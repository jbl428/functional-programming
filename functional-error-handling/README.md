## Functional error handling

Let's see how to handle errors in a functional way.

A function that returns errors or throws exceptions is an example of a partial function.

In the previous chapters we have seen that every partial function `f` can always be brought back to a total one `f'`.

```
f': X ⟶ Option(Y)
```

Now that we know a bit more about sum types in TypeScript we can define the `Option` without much issues.
