import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from '@/crypto/crypto.service';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private crypto: CryptoService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User credentials are invalid');
    }

    const isPasswordValid = await this.crypto.compare(
      password,
      user.password,
      user.salt,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials are invalid');
    }

    const accessToken = this.jwt.sign({ userId: user.id });

    return {
      access_token: accessToken,
    };
  }
}
