import { DeleteAnswerUseCase } from "@/domain/forum/application/usecases/delete-answer";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { BadRequestException, Controller, Delete, HttpCode, Param } from "@nestjs/common";
import { log } from "node:console";

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(
    private deleteAnswer: DeleteAnswerUseCase
  ) {}
  
  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteAnswer.execute({
      authorId: user.sub,
      answerId: id,
    })
    
    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}