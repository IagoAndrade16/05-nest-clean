import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
  abstract findById(id: string): Promise<Answer | null>
  abstract findManyByQuestionId(
    params: PaginationParams,
    questionId: string,
  ): Promise<Answer[]>
  abstract delete(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
}
