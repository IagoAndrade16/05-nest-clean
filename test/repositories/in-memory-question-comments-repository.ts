import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  async create(questionComment: QuestionComment): Promise<void> {
    this.questionComments.push(questionComment)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    return (
      this.questionComments.find((comment) => comment.id.toString() === id) ||
      null
    )
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    this.questionComments = this.questionComments.filter(
      (comment) => comment.id !== questionComment.id,
    )
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    return this.questionComments
      .filter((comment) => comment.questionId.toString() === questionId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
  }
}
