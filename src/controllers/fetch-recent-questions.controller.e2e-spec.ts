import { INestApplication } from '@nestjs/common';
import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('FetchRecentQuestionsController (e2e) - [GET] /questions', () => {
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

  it(`Should fetch recent questions successfully`, async () => {
    const user = await prisma.user.create({
      data: {
        name: 'john doe',
        email: 'john.doe@example.com',
        password: '12345678',
        salt: 'salt',
      },
    });

    const accessToken = jwt.sign({ userId: user.id });

    const questions = [
      {
        title: 'Q1',
        content: 'Question 1 content',
      },
      {
        title: 'Q2',
        content: 'Question 2 content',
      },
      {
        title: 'Q3',
        content: 'Question 3 content',
      },
    ];

    await prisma.question.createMany({
      data: [
        ...questions.map((question) => ({
          ...question,
          slug: question.title.toLowerCase(),
          userId: user.id,
        })),
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    // console.log(response);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Q1' }),
        expect.objectContaining({ title: 'Q2' }),
        expect.objectContaining({ title: 'Q3' }),
      ],
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
