import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerAttachment(
  override?: Partial<AnswerAttachmentProps>,
  id?: UniqueEntityID,
): AnswerAttachment {
  const answerattachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID('answerId'),
      attachmentId: new UniqueEntityID('attachmentId'),
      ...override,
    },
    id,
  )

  return answerattachment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps>): Promise<AnswerAttachment> {
    const attachment = makeAnswerAttachment(data)

    await this.prismaService.attachment.update({
      where: {
        id: attachment.attachmentId.toString()
      },
      data: {
        answerId: attachment.answerId.toString(),
      }
    })

    return attachment
  }
}
