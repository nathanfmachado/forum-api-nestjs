import { INestApplication } from '@nestjs/common';
import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('CreateQuestionController (e2e) - [POST] /questions', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    jwt = moduleRef.get<JwtService>(JwtService);

    await app.init();
  });

  it(`Should create a question successfully`, async () => {
    const user = await prisma.user.create({
      data: {
        name: 'john doe',
        email: 'john.doe@example.com',
        password: '12345678',
        salt: 'salt',
      },
    });

    const accessToken = jwt.sign({ userId: user.id });

    const data = {
      title: 'How to create a new question?',
      content:
        "I'm trying to create a new question using the API, but I'm not sure how to do it. Can someone help me?",
    };

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(data);

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'How to create a new question?' },
    });

    expect(response.status).toBe(201);
    expect(questionOnDatabase).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
