import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('delete answercomment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should not be able to delete a answer comment from another author', async () => {
    const answercomment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answercomment)

    const result = await sut.execute({
      answercommentId: answercomment.id.toString(),
      authorId: 'another-author-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be able to delete a answer comment', async () => {
    const answercomment = makeAnswerComment()
    await inMemoryAnswerCommentsRepository.create(answercomment)

    await sut.execute({
      answercommentId: answercomment.id.toString(),
      authorId: answercomment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.answerComments).toHaveLength(0)
  })
})
