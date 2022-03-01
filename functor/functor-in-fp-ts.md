## `fp-ts` 에서의 functor

`fp-ts` 에서는 어떻게 functor 를 정의할까요? 예제를 살펴봅시다.

다음 인터페이스는 어떤 HTTP API 의 결과를 표현한 것입니다:

```typescript
interface Response<A> {
  url: string
  status: number
  headers: Record<string, string>
  body: A
}
```

`boby` 는 타입 파라미터를 받기 때문에 이는 `Response` 가 functor 인스턴스의 후보가 된다는 것을 확인해주세요. 즉 `Response` 는 `n` 개의 파라미터를 받는 type constructor 조건을 만족합니다. (필요조건)

`Response` 의 functor 인스턴스를 만들기 위해, `fp-ts` 가 요구하는 [기술적인 상세](https://gcanti.github.io/fp-ts/recipes/HKT.html) 와 함께 `map` 함수를 정의해야 합니다.

```typescript
// `Response.ts` module

import { pipe } from 'fp-ts/function'
import { Functor1 } from 'fp-ts/Functor'

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly Response: Response<A>
  }
}

export interface Response<A> {
  readonly url: string
  readonly status: number
  readonly headers: Record<string, string>
  readonly body: A
}

export const map = <A, B>(f: (a: A) => B) => (
  fa: Response<A>
): Response<B> => ({
  ...fa,
  body: f(fa.body)
})

// `Response<A>` 의 functor 인스턴스
export const Functor: Functor1<'Response'> = {
  URI: 'Response',
  map: (fa, f) => pipe(fa, map(f))
}
```
