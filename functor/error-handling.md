## Functor 와 함수형 에러처리

Functor 는 함수형 에러처리에 긍적적인 효과를 발휘합니다: 다음 실용적인 예제를 살펴봅시다:

```typescript
declare const doSomethingWithIndex: (index: number) => string

export const program = (ns: ReadonlyArray<number>): string => {
  // -1 는 원하는 요소가 없다는 것을 의미합니다
  const i = ns.findIndex((n) => n > 0)
  if (i !== -1) {
    return doSomethingWithIndex(i)
  }
  throw new Error('양수를 찾을 수 없습니다')
}
```

기본 `findIndex` API 를 사용하면 결과가 `-1` 이 아닌지 확인해야 하는 `if` 문을 무조건 사용해야합니다. 만약 깜박한 경우, `doSomethingWithIndex` 에 의도하지 않은 입력인 `-1` 을 전달할 수 있습니다.

`Option` 과 해당 functor 인스턴스를 사용해 동일한 결과를 얻는 것이 얼마나 쉬운지 살펴봅시다:

```typescript
import { pipe } from 'fp-ts/function'
import { map, Option } from 'fp-ts/Option'
import { findIndex } from 'fp-ts/ReadonlyArray'

declare const doSomethingWithIndex: (index: number) => string

export const program = (ns: ReadonlyArray<number>): Option<string> =>
  pipe(
    ns,
    findIndex((n) => n > 0),
    map(doSomethingWithIndex)
  )
```

`Option` 을 사용하면, 우리는 `happy path` 에 대해서만 생각할 수 있으며, 에러처리는 `map` 안에서 내부적으로 이뤄집니다.

**데모** (optional)

[`04_functor.ts`](/src/04_functor.ts)

**문제**. `Task<A>` 는 항상 성공하는 비동기 호출을 의미합니다. 그렇다면 실패할 수 있는 계산작업은 어떻게 모델링할까요?
