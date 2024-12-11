import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('delete questioncomment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should not be able to delete a question comment from another author', async () => {
    const questioncomment = makeQuestionComment()
    await inMemoryQuestionCommentsRepository.create(questioncomment)

    const result = await sut.execute({
      questioncommentId: questioncomment.id.toString(),
      authorId: 'another-author-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be able to delete a question comment', async () => {
    const questioncomment = makeQuestionComment()
    await inMemoryQuestionCommentsRepository.create(questioncomment)

    await sut.execute({
      questioncommentId: questioncomment.id.toString(),
      authorId: questioncomment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.questionComments).toHaveLength(0)
  })
})
