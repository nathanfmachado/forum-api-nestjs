import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { CryptoService } from '@/crypto/crypto.service';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, name, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists');
    }

    const salt = await this.crypto.generateRandomSalt();
    const hashedPassword = await this.crypto.generateHashWithSalt(
      password,
      salt,
    );

    await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        salt,
      },
    });
  }
}
