import { EditQuestionUseCase } from "@/domain/forum/application/usecases/edit-question";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string())
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(
    private editQuestion: EditQuestionUseCase
  ) {}
  
  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBodySchema,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content, attachments } = body 

    const result = await this.editQuestion.execute({
      authorId: user.sub,
      content,
      title,
      questionId: id,
      attachmentsIds: attachments
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}