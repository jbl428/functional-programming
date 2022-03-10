// ====================
// 숫자 맞추기
// ====================

import { pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as O from 'fp-ts/Option'
import { between } from 'fp-ts/Ord'
import { randomInt } from 'fp-ts/Random'
import * as T from 'fp-ts/Task'
import { getLine, putStrLn } from './Console'

// 맞추어야 할 숫자
export const secret: T.Task<number> = T.fromIO(randomInt(1, 100))

// combinator: 행동 전에 메시지를 출력
const withMessage = <A>(message: string, next: T.Task<A>): T.Task<A> =>
  pipe(
    putStrLn(message),
    T.chain(() => next)
  )

// 입력값은 문자열이므로 검증해야 한다
const isValidGuess = between(N.Ord)(1, 100)
const parseGuess = (s: string): O.Option<number> => {
  const n = parseInt(s, 10)
  return isNaN(n) || !isValidGuess(n) ? O.none : O.some(n)
}

const question: T.Task<string> = withMessage('숫자를 맞춰보세요', getLine)

const answer: T.Task<number> = pipe(
  question,
  T.chain((s) =>
    pipe(
      s,
      parseGuess,
      O.match(
        () => withMessage('1 부터 100 사이의 숫자를 넣어주세요', answer),
        (a) => T.of(a)
      )
    )
  )
)

const check = <A>(
  secret: number, // 맞추어야 할 숫자
  guess: number, // 시도 횟수
  ok: T.Task<A>, // 맞춘 경우 해야할 일
  ko: T.Task<A> // 맞추지 못한 경우 해야할 일
): T.Task<A> => {
  if (guess > secret) {
    return withMessage('높아요', ko)
  } else if (guess < secret) {
    return withMessage('낮아요', ko)
  } else {
    return ok
  }
}

const end: T.Task<void> = putStrLn('맞추셨습니다!')

// 함수의 인자로서 상태 (secret) 를 유지합니다
const loop = (secret: number): T.Task<void> =>
  pipe(
    answer,
    T.chain((guess) => check(secret, guess, end, loop(secret)))
  )

const program: T.Task<void> = pipe(secret, T.chain(loop))

program()
