import { EditAnswerUseCase } from "@/domain/forum/application/usecases/edit-answer";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Param, Put } from "@nestjs/common";
import { z } from "zod";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([])
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(
    private editAnswer: EditAnswerUseCase
  ) {}
  
  @Put()
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBodySchema,
    @Param('id') id: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content, attachments } = body 

    const result = await this.editAnswer.execute({
      authorId: user.sub,
      content,
      answerId: id,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}