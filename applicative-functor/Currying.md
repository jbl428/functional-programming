## Currying

우선 타입 `B` 와 `C` (tuple 로 표현할 수 있습니다) 두 개의 인자를 받고 타입 `D` 를 반환하는 함수 모델링이 필요합니다.

```typescript
g: (b: B, c: C) => D
```

**currying** 으로 불리는 기법을 사용해 `g` 를 다시 작성할 수 있습니다.

> Currying 은 여러 개의 인자를 받는 함수의 평가를 각각 하나의 인자를 가진 일련의 함수들의 평가하는 것으로 변환하는 기술입니다. 예를 들어, 두 개의 인자 `B` 와 `C` 를 받아 `D` 를 반환하는 함수를 currying 하면 `B` 하나를 받는 함수로 변환되며 해당 함수는 `C` 를 받아 `D` 를 반환하는 함수를 반환합니다.

(출처: [wikipedia.org](https://en.wikipedia.org/wiki/Currying))

따라서, currying 을 통해 `g` 를 다음과 같이 작성할 수 있습니다:

```typescript
g: (b: B) => (c: C) => D
```

**예제**

```typescript
interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const addFollower = (follower: User, user: User): User => ({
  ...user,
  followers: [...user.followers, follower]
})
```

Currying 을 통해 `addFollower` 를 개선해봅시다

```typescript
interface User {
  readonly id: number
  readonly name: string
  readonly followers: ReadonlyArray<User>
}

const addFollower = (follower: User) => (user: User): User => ({
  ...user,
  followers: [...user.followers, follower]
})

// -------------------
// 사용 예제
// -------------------

const user: User = { id: 1, name: 'Ruth R. Gonzalez', followers: [] }
const follower: User = { id: 3, name: 'Marsha J. Joslyn', followers: [] }

console.log(addFollower(follower)(user))
/*
{
  id: 1,
  name: 'Ruth R. Gonzalez',
  followers: [ { id: 3, name: 'Marsha J. Joslyn', followers: [] } ]
}
*/
```
