import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { PrismaCommentwithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}
  
  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if(!comment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(comment);
  }

  async findManyByAnswerId(answerId: string, options: { page: number; }): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId
      },
      take: 20,
      skip: (options.page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map(PrismaAnswerCommentMapper.toDomain);
  }
  async findManyByAnswerIdWithAuthor(answerId: string, options: { page: number; }): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId
      },
      include: {
        author: true,
      },
      take: 20,
      skip: (options.page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map(PrismaCommentwithAuthorMapper.toDomain);
  }

}