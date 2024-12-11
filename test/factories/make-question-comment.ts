import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { faker } from '@faker-js/faker'

export function makeQuestionComment(
  override?: Partial<QuestionCommentProps>,
  id?: UniqueEntityID,
): QuestionComment {
  const questioncomment = QuestionComment.create(
    {
      authorId: new UniqueEntityID('authorId'),
      content: faker.lorem.text(),
      questionId: new UniqueEntityID('questionId'),
      ...override,
    },
    id,
  )

  return questioncomment
}
