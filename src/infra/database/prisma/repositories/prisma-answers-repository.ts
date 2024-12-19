import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { Injectable } from "@nestjs/common";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answersAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async findManyByQuestionId(params: PaginationParams, questionId: string): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if(!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId
      }
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    await this.answersAttachmentsRepository.createMany(answer.attachments.getItems());
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });

  }
  async save(answer: Answer): Promise<void> {
    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: answer.id.toString()
        },
        data: PrismaAnswerMapper.toPrisma(answer)
      }),
      await this.answersAttachmentsRepository.createMany(answer.attachments.getNewItems()),
      await this.answersAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems()),
    ])
  }

}