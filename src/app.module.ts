import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { CryptoService } from './crypto/crypto.service';
import { envSchema } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (envConfig) => envSchema.parse(envConfig),
      isGlobal: true,
    }),
  ],
  controllers: [CreateAccountController],
  providers: [AppService, PrismaService, CryptoService],
})
export class AppModule {}
