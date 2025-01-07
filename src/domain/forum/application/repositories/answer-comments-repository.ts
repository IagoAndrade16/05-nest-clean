import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract findManyByAnswerId(
    answerId: string,
    options: { page: number },
  ): Promise<AnswerComment[]>
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    options: { page: number },
  ): Promise<CommentWithAuthor[]>
}
