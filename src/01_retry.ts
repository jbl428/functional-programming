/*

  성공할 때까지 반복적으로 작업을 수행하는 작업에 대한 추상화입니다.

  이 모듈은 다음과 같은 3가지 요소로 이루어집니다:

  - the model
  - primitives
  - combinators

*/

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

export interface RetryStatus {
  /** 반복자, `0` 은 첫 번째 시도를 의미합니다 */
  readonly iterNumber: number

  /** 가장 최근 시도의 지연시간. 첫 번째 시도에서는 항상 `undefined` 입니다 */
  readonly previousDelay: number | undefined
}

export const startStatus: RetryStatus = {
  iterNumber: 0,
  previousDelay: undefined
}

/**
 * `RetryPolicy` 는 `RetryStatus` 를 인자로 받고 지연시간을 밀리초로 반환하는 함수입니다.
 * 반복자는 0에서 시작하고 각 시도마다 1씩 증가합니다.
 * 만약 *undefined* 를 반환했다면 재시도 제한에 도달했다는 것을 의미합니다.
 */
export interface RetryPolicy {
  (status: RetryStatus): number | undefined
}

// -------------------------------------------------------------------------------------
// primitives
// -------------------------------------------------------------------------------------

/**
 * 무제한 시도하는 상수시간 지연
 */
export const constantDelay = (delay: number): RetryPolicy => () => delay

/**
 * 최대 `i` 번까지 즉시 재시도
 */
export const limitRetries = (i: number): RetryPolicy => (status) =>
  status.iterNumber >= i ? undefined : 0

/**
 * 각 시도마다 지연시간이 기하급수적으로 증가한다.
 * 지연시간은 2의 거듭제곱으로 증가한다
 */
export const exponentialBackoff = (delay: number): RetryPolicy => (status) =>
  delay * Math.pow(2, status.iterNumber)

// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------

/**
 * 주어진 정책의 최대 지연시간 상한값을 설정합니다.
 */
export const capDelay = (maxDelay: number) => (
  policy: RetryPolicy
): RetryPolicy => (status) => {
  const delay = policy(status)
  return delay === undefined ? undefined : Math.min(maxDelay, delay)
}

/**
 * 두 정책을 병합합니다. **Quiz**: 두 정책을 병합한다는 것은 무엇을 의미할까요?
 */
export const concat = (second: RetryPolicy) => (
  first: RetryPolicy
): RetryPolicy => (status) => {
  const delay1 = first(status)
  const delay2 = second(status)
  if (delay1 !== undefined && delay2 !== undefined) {
    return Math.max(delay1, delay2)
  }
  return undefined
}

// -------------------------------------------------------------------------------------
// tests
// -------------------------------------------------------------------------------------

/**
 * 정책을 상태에 적용하고 그 결과를 확인합니다.
 */
export const applyPolicy = (policy: RetryPolicy) => (
  status: RetryStatus
): RetryStatus => ({
  iterNumber: status.iterNumber + 1,
  previousDelay: policy(status)
})

/**
 * 정책을 적용하고 중간 결과를 모두 반환합니다.
 */
export const dryRun = (policy: RetryPolicy): ReadonlyArray<RetryStatus> => {
  const apply = applyPolicy(policy)
  let status: RetryStatus = apply(startStatus)
  const out: Array<RetryStatus> = [status]
  while (status.previousDelay !== undefined) {
    out.push((status = apply(out[out.length - 1])))
  }
  return out
}

import { pipe } from 'fp-ts/function'

/*
  constantDelay(300)
    |> concat(exponentialBackoff(200))
    |> concat(limitRetries(5))
    |> capDelay(2000)
*/
const myPolicy = pipe(
  constantDelay(300),
  concat(exponentialBackoff(200)),
  concat(limitRetries(5)),
  capDelay(2000)
)

console.log(dryRun(myPolicy))
/*
[
  { iterNumber: 1, previousDelay: 300 },      <= constantDelay
  { iterNumber: 2, previousDelay: 400 },      <= exponentialBackoff
  { iterNumber: 3, previousDelay: 800 },      <= exponentialBackoff
  { iterNumber: 4, previousDelay: 1600 },     <= exponentialBackoff
  { iterNumber: 5, previousDelay: 2000 },     <= capDelay
  { iterNumber: 6, previousDelay: undefined } <= limitRetries
]
*/
