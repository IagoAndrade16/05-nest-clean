import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { PrismaAttachmentsRepository } from "./prisma-attachments-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if(!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if(!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }
  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`);

    if(cacheHit) {
      const cacheData = JSON.parse(cacheHit)
      return PrismaQuestionDetailsMapper.toDomain(cacheData)
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      }
    });

    if(!question) {
      return null;
    }

    await this.cache.set(`question:${slug}:details`, JSON.stringify(question));
    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);


    return questionDetails;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    await this.questionAttachmentsRepository.createMany(question.attachments.getItems());

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    });
  }

  async save(question: Question): Promise<void> {
    await Promise.all([
      this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data: PrismaQuestionMapper.toPrisma(question),
      }),
      this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
      this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
      this.cache.delete(`question:${question.slug}:details`)
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}