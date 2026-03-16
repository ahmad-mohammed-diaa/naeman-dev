import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { StaticQueryService } from './static-query.service';
import { UpdateStaticDto } from '../dto/update-static.dto';

@Injectable()
export class StaticUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly query: StaticQueryService,
  ) {}

  async update(dto: UpdateStaticDto) {
    const page = await this.query.get();

    await this.prisma.$transaction(async (tx) => {
      const client = tx as unknown as PrismaClient;
      if (dto.content || dto.location || dto.time) {
        if (page.about) {
          await client.about.update({
            where: { id: page.id },
            data: {
              ...(dto.content && { content: dto.content }),
              ...(dto.location && { location: dto.location }),
              ...(dto.time && { time: dto.time }),
            },
          });
        } else {
          await client.about.create({
            data: {
              id: page.id,
              content: dto.content ?? '',
              location: dto.location ?? '',
              time: dto.time ?? '',
            },
          });
        }
      }

      if (dto.questions) {
        await client.questions.deleteMany({ where: { staticId: page.id } });
        await client.questions.createMany({
          data: dto.questions.map((q) => ({
            question: q.question,
            answer: q.answer,
            staticId: page.id,
          })),
        });
      }
    });

    return this.query.get();
  }
}
