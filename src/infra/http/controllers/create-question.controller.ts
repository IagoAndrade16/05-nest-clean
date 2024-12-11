import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/authentication/current-user-decorator";
import { JwtAuthGuard } from "@/infra/authentication/jwt-auth.guard";
import { UserPayload } from "@/infra/authentication/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(
    private prismaService: PrismaService
  ) {}
  
  @Post()
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema)) 
    body: CreateQuestionBodySchema,

    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body 

    await this.prismaService.question.create({
      data: {
        title,
        slug: this.convertTitleToSlug(title),
        content,
        authorId: user.sub
      }
    })
  }

  private convertTitleToSlug(title: string): string {
    return title
      .normalize('NFD') // Normalize the string to decompose combined characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9 ]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
  }
}