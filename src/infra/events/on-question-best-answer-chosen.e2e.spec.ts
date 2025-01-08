import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";

describe('On question best answer chosen (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  beforeAll(async () => {
    DomainEvents.shouldRun = true
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init();
  });

  it('should send a notification when question best answer is chosen', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })
    const { id: answerId } = await answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id })

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({})

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString()
        }
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})