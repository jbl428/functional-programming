## Category 로 프로그래밍 언어 모델링

Category 는 **타입이 있는 프로그래밍 언어** 의 단순화된 모델로 볼 수 있습니다.

- object 는 **타입** 으로
- morphism 은 **함수** 로
- `∘` 을 일반적인 **함수의 합성** 으로

다음 다이어그램에서:

<img src="/images/category.png" width="300" alt="a simple programming language" />

3가지 타입과 6가지 함수를 가진 가상의 (그리고 단순한) 프로그래밍 언어로 생각할 수 있습니다.

예를 들면:

- `A = string`
- `B = number`
- `C = boolean`
- `f = string => number`
- `g = number => boolean`
- `g ∘ f = string => boolean`

그리고 다음과 같이 구현할 수 있습니다:

```typescript
const idA = (s: string): string => s

const idB = (n: number): string => n

const idC = (b: boolean): boolean => b

const f = (s: string): number => s.length

const g = (n: number): boolean => n > 2

// gf = g ∘ f
const gf = (s: string): boolean => g(f(s))
```
