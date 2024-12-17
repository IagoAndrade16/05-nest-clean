import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe('Comment on question (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init();
  });

  test('[POST] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const { id: questionId } = await questionFactory.makePrismaQuestion({ authorId: user.id })

    const res = await request(app.getHttpServer())
      .post(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        content: 'new comment',
      })

    expect(res.status).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        questionId: questionId.toString()
      }
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})