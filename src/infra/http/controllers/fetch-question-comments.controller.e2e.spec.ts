import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let commentFactory: QuestionCommentFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    commentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init();
  });

  test('[GET] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
    
    await Promise.all([
      commentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: 'Comment 1' }),
      commentFactory.makePrismaQuestionComment({ authorId: user.id, questionId: question.id, content: 'Comment 2' }),
    ])

    const res = await request(app.getHttpServer())
      .get(`/questions/${question.id}/comments`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Comment 1', authorName: 'John Doe' }),
        expect.objectContaining({ content: 'Comment 2', authorName: 'John Doe' }),
      ])
    })
  })
})