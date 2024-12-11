import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments'

let inMemoryCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('fetch recent comments', () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryCommentsRepository)
  })

  it('should be able to fetch recent answer comments', async () => {
    await inMemoryCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('1'),
        createdAt: new Date('2021-01-01'),
      }),
    )

    await inMemoryCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('1'),
        createdAt: new Date('2021-01-02'),
      }),
    )

    await inMemoryCommentsRepository.create(
      makeAnswerComment({
        createdAt: new Date('2021-01-03'),
        answerId: new UniqueEntityID('1'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      answerId: '1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments.length).toBe(3)
  })

  it('should be able to fetch paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: '1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments.length).toBe(2)
  })
})
