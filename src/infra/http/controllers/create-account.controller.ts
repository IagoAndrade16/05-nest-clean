import { RegisterStudentUseCase } from "@/domain/forum/application/usecases/register-student";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
})

type CreateAccountSchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}
  
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountSchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password
    })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}