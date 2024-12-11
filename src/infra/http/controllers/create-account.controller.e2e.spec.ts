import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService)
    await app.init();
  });

  test('[POST] /accounts', async () => {
    const res = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Test',
      email: 'email@example.com',
      password: '12345678',
    })

    expect(res.status).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'email@example.com',
      }
    })

    expect(userOnDatabase).toBeTruthy()
  })
})