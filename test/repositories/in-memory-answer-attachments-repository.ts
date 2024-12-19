import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.id === item.id)
    })
  }

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.items.filter(
      (comment) => comment.answerId.toString() === answerId,
    )
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter(
      (comment) => comment.answerId.toString() !== answerId,
    )
  }
}
