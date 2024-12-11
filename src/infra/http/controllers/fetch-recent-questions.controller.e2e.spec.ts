import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
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

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'email@example.com',
        password: '12345678',
      }
    })

    const access_token = jwt.sign({ sub: user.id })
    await prisma.question.createMany({
      data: [
        {
          title: 'title1',
          content: 'content1',
          authorId: user.id,
          slug: 'slug 1',
        },
        {
          title: 'title2',
          content: 'content2',
          authorId: user.id,
          slug: 'slug 2',
        },
      ]
    })

    const res = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body.questions).toHaveLength(2)
  })
})