import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe('Delete answer comment (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let answerCommentFactory: AnswerCommentFactory
  let questionCommentFactory: QuestionFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, AnswerFactory, AnswerCommentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionCommentFactory = moduleRef.get(QuestionFactory)

    await app.init();
  });

  test('[DELETE] /answers/comments/:answerComment', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionCommentFactory.makePrismaQuestion({ authorId: user.id })
    const answer = await answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id })
    const answerComment = await answerCommentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id })

    const res = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerComment.id}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerComment.id.toString(),
      }
    })

    expect(commentOnDatabase).toBeNull()
  })
})