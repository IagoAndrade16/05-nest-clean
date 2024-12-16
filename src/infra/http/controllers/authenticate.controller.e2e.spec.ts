import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing'
import { hash } from "bcryptjs";
import request from 'supertest'
import { StudentFactory } from "test/factories/make-student";

describe('Authenticate (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory]
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory)
    await app.init();
  });

  test('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      email: 'email@example.com',
      password: await hash('12345678', 8),
    })
    const res = await request(app.getHttpServer()).post('/sessions').send({
      email: 'email@example.com',
      password: '12345678',
    })

    expect(res.status).toBe(201)

    expect(res.body).toHaveProperty('access_token')
  })
})