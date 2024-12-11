import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService
  let jwt: JwtService
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)

    await app.init();
  });

  test('[POST] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'email@example.com',
        password: '12345678',
      }
    })

    const access_token = jwt.sign({ sub: user.id })
    const res = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'title',
        content: 'content',
      })

    expect(res.status).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'title',
      }
    })

    expect(questionOnDatabase).toBeTruthy()
  })
})