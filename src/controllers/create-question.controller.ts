import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TokenPayloadModel } from '@/auth/jwt.strategy';
import { TokenPayload } from '@/auth/token-payload.decorator';
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';
import { PrismaService } from '@/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @TokenPayload() tokenPayload: TokenPayloadModel,
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
  ) {
    const { title, content } = body;

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: this.generateSlug(title),
        userId: tokenPayload.userId,
      },
    });

    return;
  }

  private generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
