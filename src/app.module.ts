import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { CryptoService } from './crypto/crypto.service';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (envConfig) => envSchema.parse(envConfig),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [AppService, PrismaService, CryptoService],
})
export class AppModule {}
