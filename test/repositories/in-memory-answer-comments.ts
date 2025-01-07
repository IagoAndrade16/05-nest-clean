import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(
    private studentsRepository: InMemoryStudentsRepository
  ) {}

  public answerComments: AnswerComment[] = []

  async create(answerComment: AnswerComment): Promise<void> {
    this.answerComments.push(answerComment)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    return (
      this.answerComments.find((comment) => comment.id.toString() === id) ||
      null
    )
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    this.answerComments = this.answerComments.filter(
      (comment) => comment.id !== answerComment.id,
    )
  }

  async findManyByAnswerId(
    answerId: string,
    params: { page: number },
  ): Promise<AnswerComment[]> {
    return this.answerComments
      .filter((comment) => comment.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
  }
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: { page: number },
  ): Promise<CommentWithAuthor[]> {
    return this.answerComments
      .filter((comment) => comment.answerId.toString() === answerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if(!author) {
          throw new Error('Author not found')
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          author: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })
  }
}
