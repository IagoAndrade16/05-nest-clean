import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from "test/factories/make-attachment";
import { NotificationFactory } from "test/factories/make-notification";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe('Get question by slug (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let notificationFactory: NotificationFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get<JwtService>(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init();
  });

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const access_token = jwt.sign({ sub: user.id })
   
    const notification = await notificationFactory.makePrismaNotification({ recipientId: user.id })

    const res = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id}/read`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(res.status).toBe(204)
    const notificationsOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString()
      }
    })

    expect(notificationsOnDatabase?.readAt).not.toBeNull()
  })
})