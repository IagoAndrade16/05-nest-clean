import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'

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
