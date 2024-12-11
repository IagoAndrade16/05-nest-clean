import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class PrismaAnswersRepository implements AnswersRepository {
  findManyByQuestionId(params: PaginationParams, questionId: string): Promise<Answer[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Answer | null> {
    throw new Error("Method not implemented.");
  }
  findByQuestionId(questionId: string): Promise<Answer[]> {
    throw new Error("Method not implemented.");
  }
  create(answer: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(answer: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(answer: Answer): Promise<void> {
    throw new Error("Method not implemented.");
  }

}