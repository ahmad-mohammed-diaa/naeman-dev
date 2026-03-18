import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class StaticQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    try {
      const AboutApp = await this.prisma.static.findFirst({
        include: { about: true, questions: true },
      });
      if (!AboutApp) {
        throw new NotFoundException('Static page not found');
      }
      return { static: AboutApp };
    } catch (err) {
      throw new InternalServerErrorException('Static page not found', err);
    }
  }
}
