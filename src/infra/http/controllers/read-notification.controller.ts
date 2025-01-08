
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/usecases/get-question-by-slug";
import { BadRequestException, Controller, Get, HttpCode, Param, Patch } from "@nestjs/common";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ReadNotificationUseCase } from "@/domain/notification/application/usecases/read-notification";


@Controller('/notifications/:notificationId/read')
export class ReadNotifcationController {
  constructor(
    private readNotification: ReadNotificationUseCase
  ) {}
  
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string, 
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: user.sub
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}