import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { CryptoService } from './crypto/crypto.service';

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [AppService, PrismaService, CryptoService],
})
export class AppModule {}
