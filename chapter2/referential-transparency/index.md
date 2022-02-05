## 참조 투명성

> **정의**. 표현식이 평가되는 결과로 바꿔도 프로그래밍의 동작이 변하지 않는다면 해당 표현식은 참조에 투명하다고 말합니다.

**예제** (참조 투명성은 순수함수를 사용하는 것을 의미합니다)

```ts
const double = (n: number): number => n * 2

const x = double(2)
const y = double(2)
```

`double(2)` 표현식은 그 결과인 4로 변경할 수 있기에 참조 투명성을 가지고 있습니다.

따라서 코드를 아래와 같이 바꿀 수 있습니다.

```ts
const x = 4
const y = x
```

모든 표현식이 항상 참조 투명하지는 않습니다. 다음 예제를 봅시다.

**예제** (참조 투명성은 에러를 던지지 않는것을 의미합니다)

```ts
const inverse = (n: number): number => {
  if (n === 0) throw new Error('cannot divide by zero')
  return 1 / n
}

const x = inverse(0) + 1
```

`inverse(0)` 는 참조 투명하지 않기 때문에 결과로 대체할 수 없습니다.

**예제** (참조 투명성을 위해 불변 자료구조를 사용해야 합니다)

```ts
const xs = [1, 2, 3]

const append = (xs: Array<number>): void => {
  xs.push(4)
}

append(xs)

const ys = xs
```

마지막 라인에서 `xs` 는 초기값인 `[1, 2, 3]` 으로 대체할 수 없습니다. 왜냐하면 `append` 함수를 호출해 값이 변경되었기 때문입니다.

왜 참조 투명성이 중요할까요? 다음과 같은 것을 얻을 수 있기 때문입니다:

- **지역적인 코드분석** 코드를 이해하기 위해 외부 문맥을 알 필요가 없습니다
- **코드 수정** 시스템의 동작을 변경하지 않고 코드를 수정할 수 있습니다

**문제**. 다음과 같은 프로그램이 있다고 가정합시다:

```ts
// Typescript 에서 `declare` 를 사용하면 함수의 구현부 없이 선언부만 작성할 수 있습니다
declare const question: (message: string) => Promise<string>

const x = await question('What is your name?')
const y = await question('What is your name?')
```

다음과 같이 코드를 수정해도 괜찮을까요? 프로그램 동작이 변할까요?

```ts
const x = await question('What is your name?')
const y = x
```

보시다시피 참조 투명하지 않은 표현식을 수정하는 것은 매우 어렵습니다.
모든 표현식이 참조 투명한 함수형 프로그램에선 수정에 필요한 인지 부하를 상당히 줄일 수 있습니다.
> (원문) In functional programming, where every expression is referentially transparent, the cognitive load required to make changes is severely reduced.
