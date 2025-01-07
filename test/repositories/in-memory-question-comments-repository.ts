import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  constructor(
    private studentsRepository: InMemoryStudentsRepository
  ) {}

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
  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = this.questionComments
      .filter((comment) => comment.questionId.toString() === questionId)
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

    return questionComments
  }
}
