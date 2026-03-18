import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateComplainDto } from './dto/create-complain.dto';
import { AppNotFoundException } from '../../common/exceptions/app.exception';

const CLIENT_INCLUDE = {
  client: {
    select: {
      user: {
        select: { firstName: true, lastName: true, avatar: true, phone: true },
      },
    },
  },
};

@Injectable()
export class ComplainService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComplainDto, userId: string) {
    const complain = await this.prisma.complain.create({
      data: { message: dto.message, client: { connect: { id: userId } } },
    });
    return { data: complain, message: 'Complaint submitted successfully' };
  }

  async findAll() {
    const complains = await this.prisma.complain.findMany({
      include: CLIENT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    return { data: complains };
  }

  async findOne(id: string) {
    const complain = await this.prisma.complain.findUnique({
      where: { id },
      include: CLIENT_INCLUDE,
    });
    if (!complain) throw new AppNotFoundException('NOT_FOUND_COMPLAIN');
    return { data: complain };
  }

  async resolve(id: string) {
    await this.findOne(id);
    const updated = await this.prisma.complain.update({
      where: { id },
      data: { done: true },
    });
    return { data: updated, message: 'Complaint resolved' };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.complain.delete({ where: { id } });
    return { message: 'Complaint deleted' };
  }
}
