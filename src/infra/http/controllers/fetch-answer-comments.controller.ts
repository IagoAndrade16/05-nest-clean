
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/usecases/fetch-answer-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { z } from "zod";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(
  z.number().min(1)
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private fetchAnswerComments: FetchAnswerCommentsUseCase
  ) {}
  
  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query('page', new ZodValidationPipe(pageQueryParamSchema)) page: PageQueryParamSchema
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { answerComments } = result.value
    return {
      answerComments: answerComments.map(CommentPresenter.toHTTP),
    }
  }
}