import { INestApplication } from '@nestjs/common';
import { expect, it, describe, beforeAll, afterAll, beforeEach } from 'vitest';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import request from 'supertest';
import { PrismaService } from '@/prisma/prisma.service';
import { CryptoService } from '@/crypto/crypto.service';

describe('AuthenticateController (e2e) - [POST] /sessions', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let crypto: CryptoService;
  let userData: { name: string; email: string; password: string };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<PrismaService>(PrismaService);
    crypto = moduleRef.get<CryptoService>(CryptoService);

    await app.init();
  });

  beforeEach(async () => {
    userData = {
      name: 'john doe',
      email: 'john.doe@example.com',
      password: '12345678',
    };

    const salt = await crypto.generateRandomSalt();
    const hashedPassword = await crypto.generateHashWithSalt(
      userData.password,
      salt,
    );

    await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        salt,
      },
    });
  });

  it(`Should authenticate successfully`, async () => {
    const userCredentials = {
      email: userData.email,
      password: userData.password,
    };

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send(userCredentials);

    expect(response.status).toBe(201);
    expect(response.body.access_token).toBeTruthy();
  });

  afterAll(async () => {
    await app.close();
  });
});
