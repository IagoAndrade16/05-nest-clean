
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/usecases/delete-answer-comment";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";

@Controller('/answers/comments/:commentId')
export class DeleteAnswerCommentController {
  constructor(
    private deleteAnswerComment: DeleteAnswerCommentUseCase
  ) {}
  
  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId') answerCommentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteAnswerComment.execute({
      authorId: user.sub,
      answercommentId: answerCommentId,
    })
    
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}