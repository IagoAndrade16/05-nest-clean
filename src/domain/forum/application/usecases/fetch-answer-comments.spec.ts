import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('fetch recent comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
    sut = new FetchAnswerCommentsUseCase(inMemoryCommentsRepository)
  })

  it('should be able to fetch recent answer comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })
    await inMemoryStudentsRepository.create(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('1'),
      createdAt: new Date('2021-01-01'),
      authorId: student.id,
    })

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('1'),
      createdAt: new Date('2021-01-02'),
      authorId: student.id,
    })

    const comment3 = makeAnswerComment({
      createdAt: new Date('2021-01-03'),
      authorId: student.id,
      answerId: new UniqueEntityID('1'),
    })

    await inMemoryCommentsRepository.create(
      comment1
    )

    await inMemoryCommentsRepository.create(
      comment2
    )

    await inMemoryCommentsRepository.create(
      comment3
    )

    const result = await sut.execute({
      page: 1,
      answerId: '1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment2.id,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment3.id,
          author: 'John Doe',
        }),
      ])
    )
  })

  it('should be able to fetch paginated', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })
    await inMemoryStudentsRepository.create(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: '1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.comments.length).toBe(2)
  })
})
