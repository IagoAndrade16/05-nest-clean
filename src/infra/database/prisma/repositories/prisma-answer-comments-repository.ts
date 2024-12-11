import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error("Method not implemented.");
  }
  findManyByAnswerId(answerId: string, options: { page: number; }): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.");
  }

}