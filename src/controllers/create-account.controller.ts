import { ConflictException } from "@nestjs/common";
import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  
  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, password } = body

    const userWithEmail = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithEmail) {
      throw new ConflictException('Email already exists')
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })

    console.log(body)
  }
}