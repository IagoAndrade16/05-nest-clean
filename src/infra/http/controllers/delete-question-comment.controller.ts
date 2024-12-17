
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/usecases/delete-question-comment";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";

@Controller('/questions/comments/:commentId')
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionComment: DeleteQuestionCommentUseCase
  ) {}
  
  @Delete()
  @HttpCode(204)
  async handle(
    @Param('commentId') questionCommentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteQuestionComment.execute({
      authorId: user.sub,
      questioncommentId: questionCommentId,
    })
    
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}