import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export function makeAnswerComment(
  override?: Partial<AnswerCommentProps>,
  id?: UniqueEntityID,
): AnswerComment {
  const answercomment = AnswerComment.create(
    {
      authorId: new UniqueEntityID('authorId'),
      content: faker.lorem.text(),
      answerId: new UniqueEntityID('answerId'),
      ...override,
    },
    id,
  )

  return answercomment
}
