### `Semigroup`, `Monoid` 인스턴스

이제, 두 개의 다른 `Option<A>` 를 "병합" 한다고 가정합시다: 다음과 같은 네 가지 경우가 있습니다:

| x       | y       | concat(x, y) |
| ------- | ------- | ------------ |
| none    | none    | none         |
| some(a) | none    | none         |
| none    | some(a) | none         |
| some(a) | some(b) | ?            |

마지막 조건에서 문제가 발생합니다. 두 개의 `A` 를 "병합" 하는 방법이 필요합니다.

그런 방법이 있다면 좋을텐데... 그러고보니 우리의 옛 친구 `Semigroup` 이 하는 일 아닌가요?

| x        | y        | concat(x, y)           |
| -------- | -------- | ---------------------- |
| some(a1) | some(a2) | some(S.concat(a1, a2)) |

이제 우리가 할 일은 사용자로부터 `A` 에 대한 `Semigroup` 을 받고 `Option<A>` 에 대한 `Semigroup` 인스턴스를 만드는 것입니다.

```typescript
// 구현은 연습문제로 남겨두겠습니다
declare const getApplySemigroup: <A>(S: Semigroup<A>) => Semigroup<Option<A>>
```

**문제**. 위 semigroup 을 monoid 로 만들기 위한 항등원을 추가할 수 있을까요?

```typescript
// 구현은 연습문제로 남겨두겠습니다
declare const getApplicativeMonoid: <A>(M: Monoid<A>) => Monoid<Option<A>>
```

다음과 같이 동작하는 `Option<A>` 의 monoid 인스턴스를 정의할 수 있습니다:

| x        | y        | concat(x, y)           |
| -------- | -------- | ---------------------- |
| none     | none     | none                   |
| some(a1) | none     | some(a1)               |
| none     | some(a2) | some(a2)               |
| some(a1) | some(a2) | some(S.concat(a1, a2)) |

```typescript
// 구현은 연습문제로 남겨두겠습니다
declare const getMonoid: <A>(S: Semigroup<A>) => Monoid<Option<A>>
```

**문제**. 이 monoid 의 `empty` 멤버는 무엇일까요?

**예제**

`getMonoid` 를 사용해 다음 두 개의 유용한 monoid 을 얻을 수 있습니다:

(가장 왼쪽에 있는 `None` 이 아닌 값을 반환하는 Monoid)

| x        | y        | concat(x, y) |
| -------- | -------- | ------------ |
| none     | none     | none         |
| some(a1) | none     | some(a1)     |
| none     | some(a2) | some(a2)     |
| some(a1) | some(a2) | some(a1)     |

```typescript
import { Monoid } from 'fp-ts/Monoid'
import { getMonoid, Option } from 'fp-ts/Option'
import { first } from 'fp-ts/Semigroup'

export const getFirstMonoid = <A = never>(): Monoid<Option<A>> =>
  getMonoid(first())
```

(가장 오른쪽에 있는 `None` 이 아닌 값을 반환하는 Monoid)

| x        | y        | concat(x, y) |
| -------- | -------- | ------------ |
| none     | none     | none         |
| some(a1) | none     | some(a1)     |
| none     | some(a2) | some(a2)     |
| some(a1) | some(a2) | some(a2)     |

```typescript
import { Monoid } from 'fp-ts/Monoid'
import { getMonoid, Option } from 'fp-ts/Option'
import { last } from 'fp-ts/Semigroup'

export const getLastMonoid = <A = never>(): Monoid<Option<A>> =>
  getMonoid(last())
```

**Example**

`getLastMonoid` 는 선택적인 값을 관리하는데 유용합니다. 다음 VSCode 텍스트 편집기의 사용자 설정을 알아내는 예제를 살펴봅시다.

```typescript
import { Monoid, struct } from 'fp-ts/Monoid'
import { getMonoid, none, Option, some } from 'fp-ts/Option'
import { last } from 'fp-ts/Semigroup'

/** VSCode 설정 */
interface Settings {
  /** 글꼴 조정 */
  readonly fontFamily: Option<string>
  /** 픽셀 단위의 글꼴 크기 조정 */
  readonly fontSize: Option<number>
  /** 일정 개수의 열로 표현하기 위해 minimap 의 길이를 제한 */
  readonly maxColumn: Option<number>
}

const monoidSettings: Monoid<Settings> = struct({
  fontFamily: getMonoid(last()),
  fontSize: getMonoid(last()),
  maxColumn: getMonoid(last())
})

const workspaceSettings: Settings = {
  fontFamily: some('Courier'),
  fontSize: none,
  maxColumn: some(80)
}

const userSettings: Settings = {
  fontFamily: some('Fira Code'),
  fontSize: some(12),
  maxColumn: none
}

/** userSettings 은 workspaceSettings 을 덮어씌웁니다 */
console.log(monoidSettings.concat(workspaceSettings, userSettings))
/*
{ fontFamily: some("Fira Code"),
  fontSize: some(12),
  maxColumn: some(80) }
*/
```

**문제**. 만약 VSCode 가 한 줄당 `80` 개 이상의 열을 관리할 수 없다고 가정해봅시다. 그렇다면 `monoidSettings` 을 어떻게 수정하면 이 제한사항을 반영할 수 있을까요?
