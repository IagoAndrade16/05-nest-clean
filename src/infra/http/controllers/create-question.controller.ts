import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/create-question";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid())
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(
    private createQuestion: CreateQuestionUseCase
  ) {}
  
  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) 
    body: CreateQuestionBodySchema,

    @CurrentUser() user: UserPayload
  ) {
    const { title, content, attachments } = body 

    const result = await this.createQuestion.execute({
      attachmentsIds: attachments,
      authorId: user.sub,
      content,
      title
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}