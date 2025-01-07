import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Prisma, Question as PrismaQuestion, User as PrismaUser, Attachment as PrismaAttachment } from '@prisma/client';
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      title: raw.title,
      content: raw.content,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      authorId: new UniqueEntityID(raw.author.id),
      author: raw.author.name,
      createdAt: raw.createdAt,
      slug: Slug.create(raw.slug),
      bestAnswerId: raw.bestAnswerId ? new UniqueEntityID(raw.bestAnswerId) : null,
      updatedAt: raw.updatedAt,
    })
  }
}