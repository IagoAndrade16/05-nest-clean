import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(1)
  }

  return left('error')
}
test('success result', () => {
  const result = doSomething(true)

  if (result.isRight()) {
    expect(result.value).toBe(1)
  }

  expect(result.isRight()).toBe(true)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
})
