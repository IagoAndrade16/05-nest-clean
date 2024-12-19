import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe('Edit answer (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AnswerFactory, QuestionFactory, AttachmentFactory, AnswerAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)

    await app.init();
  });

  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id
    })
    const { id: answerId } = await answerFactory.makePrismaAnswer({ authorId: user.id, questionId: question.id })

    const attachment1 = await attachmentFactory.makePrismaAttachment({})
    const attachment2 = await attachmentFactory.makePrismaAttachment({})

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answerId,
      attachmentId: attachment1.id
    })
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answerId,
      attachmentId: attachment2.id
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment({})


    const res = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        content: 'new content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()]
      })

    expect(res.status).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        id: answerId.toString(),
      }
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id
      }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase.map(attachment => attachment.id)).toEqual([attachment1.id.toString(), attachment3.id.toString()])
  })
})