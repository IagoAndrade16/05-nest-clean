import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  findById(id: string): Promise<AnswerAttachment | null> {
    throw new Error("Method not implemented.");
  }
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error("Method not implemented.");
  }
  create(answerAttachment: AnswerAttachment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(answerAttachment: AnswerAttachment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(answerAttachment: AnswerAttachment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

}