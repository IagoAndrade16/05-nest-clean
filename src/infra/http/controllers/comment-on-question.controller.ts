
import { CommentOnQuestionUseCase } from "@/domain/forum/application/usecases/comment-on-question";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(
    private commentOnQuestion: CommentOnQuestionUseCase
  ) {}
  
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema)) 
    body: CommentOnQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body 
    
    const result = await this.commentOnQuestion.execute({
      authorId: user.sub,
      content,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}