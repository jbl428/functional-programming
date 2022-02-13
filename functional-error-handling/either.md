### `Either` 타입

계산의 실패나 오류를 던지는 부분 함수를 다루기 위해 어떻게 `Option` 자료형을 활용하는지 살펴보았습니다.

하미잔 이 자료형은 어떤 상황에서는 제한적일 수 있습니다. 성공하는 경우 `A` 의 정보를 포함한 `Some<A>` 을 얻지만 `None` 은 어떠한 데이터도 가지고 있지 않습니다. 즉 실패했다는 것은 알지만 그 이유를 알 수 없습니다.

이를 해결하기 위해 실패를 표현하는 새로운 자료형이 필요하며 이를 `Left<E>` 로 부르겠습니다. 또한 `Some<A>` 도 `Right<A>` 로 변경됩니다.

```typescript
// 실패를 표현
interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}

// 성공을 표현
interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}

type Either<E, A> = Left<E> | Right<A>
```

생성자와 패턴 매칭은 다음과 같습니다:

```typescript
const left = <E, A>(left: E): Either<E, A> => ({ _tag: 'Left', left })

const right = <A, E>(right: A): Either<E, A> => ({ _tag: 'Right', right })

const match = <E, R, A>(onLeft: (left: E) => R, onRight: (right: A) => R) => (
  fa: Either<E, A>
): R => {
  switch (fa._tag) {
    case 'Left':
      return onLeft(fa.left)
    case 'Right':
      return onRight(fa.right)
  }
}
```

이전 callback 예제로 돌아가봅시다:

```typescript
declare function readFile(
  path: string,
  callback: (err?: Error, data?: string) => void
): void

readFile('./myfile', (err, data) => {
  let message: string
  if (err !== undefined) {
    message = `Error: ${err.message}`
  } else if (data !== undefined) {
    message = `Data: ${data.trim()}`
  } else {
    // should never happen
    message = 'The impossible happened'
  }
  console.log(message)
})
```

이제 다음과 같이 signature 를 변경할 수 있습니다:

```typescript
declare function readFile(
  path: string,
  callback: (result: Either<Error, string>) => void
): void
```

그리고 다음과 같이 사용합니다:

```typescript
readFile('./myfile', (e) =>
  pipe(
    e,
    match(
      (err) => `Error: ${err.message}`,
      (data) => `Data: ${data.trim()}`
    ),
    console.log
  )
)
```
