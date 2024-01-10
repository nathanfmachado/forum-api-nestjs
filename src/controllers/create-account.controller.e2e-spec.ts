import { INestApplication } from '@nestjs/common';
import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';

describe('CreateAccountController (e2e) - [POST] /accounts', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);

    await app.init();
  });

  it(`Should create an account successfully`, async () => {
    const data = {
      name: 'john doe',
      email: 'john.doe@example.com',
      password: '12345678',
    };

    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(data);

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: data.email },
    });

    expect(response.status).toBe(201);
    expect(userOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
