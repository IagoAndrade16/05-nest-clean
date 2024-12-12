import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { JwtAuthGuard } from "@/infra/authentication/jwt-auth.guard";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/usecases/fetch-recent-questions";

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(
  z.number().min(1)
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(
  pageQueryParamSchema
)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    private fetchRecentQuestions: FetchRecentQuestionsUseCase
  ) {}
  
  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const questions = await this.fetchRecentQuestions.execute({
      page,
    })

    return {
      questions,
    }
  }
}