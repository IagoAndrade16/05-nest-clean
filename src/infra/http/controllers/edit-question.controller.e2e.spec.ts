import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe('Edit question (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init();
  });

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent({})

    const access_token = jwt.sign({ sub: user.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment({})
    const attachment2 = await attachmentFactory.makePrismaAttachment({})
    
    const { id: questionId } = await questionFactory.makePrismaQuestion({ authorId: user.id })
  
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: questionId,
      attachmentId: attachment1.id
    })
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: questionId,
      attachmentId: attachment2.id
    })

    const attachment3 = await attachmentFactory.makePrismaAttachment({})

    const res = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        title: 'new title',
        content: 'new content',
        attachments: [attachment1.id.toString(), attachment3.id.toString()]
      })

    expect(res.status).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'new title',
      }
    })

    expect(questionOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id
      }
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase.map(attachment => attachment.id)).toEqual([attachment1.id.toString(), attachment3.id.toString()])

  })
})