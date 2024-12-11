import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";

@Module({
  providers: [
    PrismaService, 
    PrismaAnswerAttachmentsRepository, 
    PrismaQuestionsRepository, 
    PrismaQuestionAttachmentsRepository, 
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository
  ],
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository, 
    PrismaQuestionsRepository, 
    PrismaQuestionAttachmentsRepository, 
    PrismaAnswerAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository
  ],
})
export class DatabaseModule {}