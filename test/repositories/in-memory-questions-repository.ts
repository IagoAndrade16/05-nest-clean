import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.questions.push(question)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return (
      this.questions.find((question) => question.slug.value === slug) || null
    )
  }

  async findById(id: string): Promise<Question | null> {
    return (
      this.questions.find((question) => question.id.toValue() === id) || null
    )
  }

  async delete(question: Question): Promise<void> {
    this.questions = this.questions.filter(
      (q) => q.id.toValue() !== question.id.toValue(),
    )

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toValue(),
    )
  }

  async save(question: Question): Promise<void> {
    this.questions = this.questions.map((q) =>
      q.id.toValue() === question.id.toValue() ? question : q,
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    return this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
  }
}
