import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { JwtAuthGuard } from "@/infra/authentication/jwt-auth.guard";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { CreateQuestionUseCase } from "@/domain/forum/application/usecases/create-question";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
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
    const { title, content } = body 

    await this.createQuestion.execute({
      attachmentsIds: [],
      authorId: user.sub,
      content,
      title
    })
  }
}