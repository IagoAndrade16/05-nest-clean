import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchQuestionCommentsUseCase

describe('fetch recent comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryCommentsRepository = new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository)
    sut = new FetchQuestionCommentsUseCase(inMemoryCommentsRepository)
  })

  it('should be able to fetch recent question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    })
    await inMemoryStudentsRepository.create(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('1'),
      createdAt: new Date('2021-01-01'),
      authorId: student.id,
    })

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('1'),
      createdAt: new Date('2021-01-02'),
      authorId: student.id,
    })

    const comment3 = makeQuestionComment({
      createdAt: new Date('2021-01-03'),
      authorId: student.id,
      questionId: new UniqueEntityID('1'),
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
      questionId: '1',
    })

    expect(result.value?.comments.length).toBe(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment1.id
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment2.id
        }),
        expect.objectContaining({
          author: 'John Doe',
          commentId: comment3.id
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
        makeQuestionComment({
          questionId: new UniqueEntityID('1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: '1',
    })

    expect(result.value?.comments.length).toBe(2)
  })
})
