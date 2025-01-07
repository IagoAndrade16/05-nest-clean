
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/usecases/fetch-question-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { z } from "zod";
import { CommentPresenter } from "../presenters/comment-presenter";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(
  z.number().min(1)
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionComments: FetchQuestionCommentsUseCase
  ) {}
  
  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query('page', new ZodValidationPipe(pageQueryParamSchema)) page: PageQueryParamSchema
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { comments } = result.value
    return {
      comments: comments.map(CommentWithAuthorPresenter.toHTTP),
    }
  }
}