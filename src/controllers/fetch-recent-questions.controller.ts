import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().int().positive());

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(pageQueryParamSchema)) page: number,
  ) {
    const perPage = 20;
    const pageOffset = (page - 1) * perPage;

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: pageOffset,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { questions };
  }
}
