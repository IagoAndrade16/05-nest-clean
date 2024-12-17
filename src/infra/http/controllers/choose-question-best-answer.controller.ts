import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/usecases/choose-question-best-answer";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { BadRequestException, Controller, HttpCode, Param, Patch, Put } from "@nestjs/common";

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase
  ) {}
  
  @Patch()
  @HttpCode(204)
  async handle(
    @Param('answerId') answerId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: user.sub,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}