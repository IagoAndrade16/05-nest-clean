import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class QuestionFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps>): Promise<Question> {
    const question = makeQuestion(data)

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
