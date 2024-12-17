import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init();
  });

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({ authorId: user.id })
    
    await Promise.all([
      answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 1' }),
      answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id, content: 'Answer 2' }),
    ])

    const res = await request(app.getHttpServer())
      .get(`/questions/${question.id}/answers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body.answers).toHaveLength(2)
  })
})