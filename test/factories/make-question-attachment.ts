import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestionAttachment(
  override?: Partial<QuestionAttachmentProps>,
  id?: UniqueEntityID,
): QuestionAttachment {
  const questionattachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID('questionId'),
      attachmentId: new UniqueEntityID('attachmentId'),
      ...override,
    },
    id,
  )

  return questionattachment
}


@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestionAttachment(data: Partial<QuestionAttachmentProps>): Promise<QuestionAttachment> {
    const attachment = makeQuestionAttachment(data)

    await this.prismaService.attachment.update({
      where: {
        id: attachment.attachmentId.toString()
      },
      data: {
        questionId: attachment.questionId.toString(),
      }
    })

    return attachment
  }
}

