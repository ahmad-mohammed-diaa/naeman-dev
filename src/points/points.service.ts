import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppSuccess } from 'src/utils/AppSuccess';
import { Language, User } from '@prisma/client';
import {
  createTranslation,
  Translation,
} from '../../src/class-type/translation';

@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  async create(offerId: string, user: User, lang: Language) {
    const offers = await this.prisma.offers.findUnique({
      where: {
        id: offerId,
      },
      select: {
        offerType: true,
        points: {
          select: {
            ...Translation(true, lang),
            price: true,
            points: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const updateUser = await this.prisma.client.update({
      where: {
        id: user.id,
      },
      data: {
        points: { increment: offers.points.points },
      },
    });
    return new AppSuccess(updateUser, 'Points added successfully');
  }

  async createPoints(
    createPointDto: CreatePointDto,
    file: Express.Multer.File,
  ) {
    const { price, points } = createPointDto;

    const offer = await this.prisma.offers.create({
      data: {
        offerType: 'POINTS',
        expiresAt: new Date(),
      },
    });

    const updatePoint = await this.prisma.offers.update({
      where: { id: offer.id },
      data: {
        points: {
          create: {
            Translation: createTranslation(createPointDto),
            price,
            points,
            expiresAt: new Date(),
            image: file?.path,
          },
        },
      },
      include: {
        points: { include: { Translation: true } },
      },
    });

    const {
      points: { Translation },
      ...rest
    } = updatePoint;

    const point = {
      ...rest,
      name: Translation[0]?.name,
    };

    return new AppSuccess(point, 'Point created successfully');
  }

  async findAll(language: Language) {
    const fetchedPoints = await this.prisma.points.findMany({
      include: Translation(true, language),
    });

    const points = fetchedPoints.map((point) => {
      const { Translation, ...rest } = point;
      return {
        ...rest,
        Translation: Translation,
        name: Translation[0]?.name,
      };
    });

    return new AppSuccess({ points }, 'Points fetched successfully');
  }

  async findOne(id: string, lang: Language) {
    if (!id) {
      return new AppSuccess(null, 'Point not found');
    }

    const fetchedPoint = await this.prisma.points.findUnique({
      where: {
        id: id,
      },
      include: Translation(true, lang),
    });

    const { Translation: translation, ...rest } = fetchedPoint;
    const point = {
      ...rest,
      name: translation[0]?.name,
    };

    return new AppSuccess(point, 'Point fetched successfully');
  }

  async purchasePoint(user: User, pointId: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!client) {
      return new AppSuccess(null, 'client not found');
    }

    const point = await this.prisma.points.findUnique({
      where: {
        id: pointId,
      },
    });

    if (!point) {
      return new AppSuccess(null, 'Point not found');
    }

    const clientPoint = await this.prisma.client.update({
      where: {
        id: user.id,
      },
      data: {
        points: {
          increment: point.points,
        },
      },
    });

    return new AppSuccess(clientPoint, 'Point purchased successfully');
  }

  update(id: string, updatePointDto: UpdatePointDto, lang: Language) {
    return `This action updates a #${id} point`;
  }

  remove(id: number) {
    return `This action removes a #${id} point`;
  }
}
