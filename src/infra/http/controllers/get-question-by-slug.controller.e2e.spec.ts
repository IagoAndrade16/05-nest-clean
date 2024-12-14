import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get question by slug (E2E)', () => {
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

  test('[GET] /questions/:slug', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'email@example.com',
        password: '12345678',
      }
    })

    const access_token = jwt.sign({ sub: user.id })
    await prisma.question.create({
      data: {
        title: 'Question 1',
        content: 'Question content',
        authorId: user.id,
        slug: 'question-1',
      },
    })

    const res = await request(app.getHttpServer())
      .get('/questions/question-1')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      question: expect.objectContaining({ title: 'Question 1' })
    })
  })
})