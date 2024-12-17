import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class AnswerCommentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps>): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data)

    await this.prismaService.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    })

    return answerComment
  }
}
