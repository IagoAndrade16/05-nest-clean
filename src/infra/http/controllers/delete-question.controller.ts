import { DeleteQuestionUseCase } from "@/domain/forum/application/usecases/delete-question";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { log } from "node:console";

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(
    private deleteQuestion: DeleteQuestionUseCase
  ) {}
  
  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteQuestion.execute({
      authorId: user.sub,
      questionId: id,
    })
    
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}