
import { CommentOnAnswerUseCase } from "@/domain/forum/application/usecases/comment-on-answer";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(
    private commentOnAnswer: CommentOnAnswerUseCase
  ) {}
  
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema)) 
    body: CommentOnAnswerBodySchema,
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body 
    
    const result = await this.commentOnAnswer.execute({
      authorId: user.sub,
      content,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}