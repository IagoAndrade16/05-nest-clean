import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    this.questions.push(question)
    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return (
      this.questions.find((question) => question.slug.value === slug) || null
    )
  }
  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.questions.find((question) => question.slug.value === slug) || null

    if(!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) => student.id.equals(question.authorId))

    if(!author) {
      throw new Error('Author not found')
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter((attachment) => attachment.questionId.equals(question.id))

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => attachment.id.equals(questionAttachment.attachmentId))

      if(!attachment) {
        throw new Error('Attachment not found')
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: author.id,
      attachments,
      author: author.name,
      content: question.content,
      createdAt: question.createdAt,
      slug: question.slug,
      title: question.title,
      bestAnswerId: question.bestAnswerId,
      updatedAt: question.updatedAt
    })
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

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    return this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)
  }
}
