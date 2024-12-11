import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('fetch recent comments', () => {
  beforeEach(() => {
    inMemoryCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryCommentsRepository)
  })

  it('should be able to fetch recent question comments', async () => {
    await inMemoryCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('1'),
        createdAt: new Date('2021-01-01'),
      }),
    )

    await inMemoryCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('1'),
        createdAt: new Date('2021-01-02'),
      }),
    )

    await inMemoryCommentsRepository.create(
      makeQuestionComment({
        createdAt: new Date('2021-01-03'),
        questionId: new UniqueEntityID('1'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: '1',
    })

    expect(result.value?.questionComments.length).toBe(3)
  })

  it('should be able to fetch paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('1'),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: '1',
    })

    expect(result.value?.questionComments.length).toBe(2)
  })
})
