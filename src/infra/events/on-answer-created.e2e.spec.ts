import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";

describe('Answer question (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  beforeAll(async () => {
    DomainEvents.shouldRun = true

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init();
  });

  it('should send a notification when answer is created', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const { id: questionId } = await questionFactory.makePrismaQuestion({ authorId: user.id })

    await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        content: 'new answer',
      })

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