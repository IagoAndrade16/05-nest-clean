import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe('Fetch recent answers (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let commentFactory: AnswerCommentFactory
  let questionFactory: QuestionFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, AnswerCommentFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    commentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init();
  });

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question  = await questionFactory.makePrismaQuestion({ authorId: user.id })
    const answer = await answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id })
    
    await Promise.all([
      commentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: 'Comment 1' }),
      commentFactory.makePrismaAnswerComment({ authorId: user.id, answerId: answer.id, content: 'Comment 2' }),
    ])

    const res = await request(app.getHttpServer())
      .get(`/answers/${answer.id}/comments`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 1',
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          content: 'Comment 2',
          authorName: 'John Doe',
        })
      ])
    )
  })
})