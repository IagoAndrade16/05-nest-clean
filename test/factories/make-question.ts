import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { faker } from '@faker-js/faker'

export function makeQuestion(
  override?: Partial<QuestionProps>,
  id?: UniqueEntityID,
): Question {
  const question = Question.create(
    {
      authorId: new UniqueEntityID('authorId'),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      slug: Slug.create('example-question'),
      ...override,
    },
    id,
  )

  return question
}
