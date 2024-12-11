import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

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
