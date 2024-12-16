import { AnswerQuestionUseCase } from "@/domain/forum/application/usecases/answer-question";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Body, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { z } from "zod";

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(
    private answerQuestion: AnswerQuestionUseCase
  ) {}
  
  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema)) 
    body: AnswerQuestionBodySchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body 
    
    const result = await this.answerQuestion.execute({
      authorId: user.sub,
      content,
      questionId,
      attachmentsIds: []
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}