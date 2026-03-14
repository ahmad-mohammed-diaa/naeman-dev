import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplainDto } from './dto/create-complain.dto';
import { Complain, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppSuccess } from 'src/utils/AppSuccess';

@Injectable()
export class ComplainService {
  constructor(private readonly prisma: PrismaService) {}

  async createComplain(
    createComplainDto: CreateComplainDto,
    user: User,
  ): Promise<AppSuccess<Complain>> {
    const complain = await this.prisma.complain.create({
      data: {
        ...createComplainDto,
        client: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return new AppSuccess(complain, 'Complain created successfully');
  }

  async getAllComplains(): Promise<AppSuccess<{ complains: Complain[] }>> {
    const complains = await this.prisma.complain.findMany({
      include: {
        client: {
          select: {
            user: {
              select: {
                id: false,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    return new AppSuccess({ complains }, 'Complains found successfully');
  }

  async findOne(id: string): Promise<AppSuccess<Complain>> {
    const complain = await this.prisma.complain.findUnique({
      where: {
        id,
      },
      include: {
        client: {
          select: {
            user: {
              select: {
                id: false,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!complain) throw new NotFoundException('Complain not found');

    return new AppSuccess(complain, 'Complain found successfully');
  }

  async updateComplain(id: string) {
    // Implement the updateComplain method
    await this.findOne(id);

    const updatedComplain = await this.prisma.complain.update({
      where: { id },
      data: {
        done: true,
      },
    });

    return new AppSuccess(updatedComplain, 'Complain updated successfully');
  }

  async remove(id: string): Promise<AppSuccess<Complain>> {
    const complain = await this.prisma.complain.findUnique({
      where: { id },
    });

    if (!complain) throw new NotFoundException('Complain not found');

    return new AppSuccess(
      await this.prisma.complain.delete({
        where: {
          id,
        },
      }),
      'Complain deleted successfully',
    );
  }
}
