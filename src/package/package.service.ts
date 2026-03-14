import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreatePackageDto } from './dto/create-package.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppSuccess } from 'src/utils/AppSuccess';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createTranslation, Translation } from 'src/class-type/translation';
import { Language } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PackageService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationService,
  ) {}

  async create(createPackageDto: CreatePackageDto, file: Express.Multer.File) {
    const { serviceIds, type, count, ...rest } = createPackageDto;

    const existingServiceIds = (
      await this.prisma.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true },
      })
    ).map((service) => service.id);

    const invalidServiceIds = serviceIds.filter(
      (serviceId) => !existingServiceIds.includes(serviceId),
    );

    if (invalidServiceIds.length > 0) {
      throw new BadRequestException(
        `Invalid service IDs: ${invalidServiceIds.join(', ')}`,
      );
    }

    if (type === 'MULTIPLE' && count > 1) {
      throw new BadRequestException(
        'Count of services must be 1 for type MULTIPLE',
      );
    }

    const image = file?.path;
    const offer = await this.prisma.offers.create({
      data: {
        offerType: 'PACKAGES',
        expiresAt: rest.expiresAt,
        packages: {
          create: {
            ...rest,
            type,
            count,
            services: { connect: serviceIds.map((id) => ({ id })) },
            ...(image && { image }),
            Translation: createTranslation(createPackageDto),
          },
        },
      },
    });

    const send = await this.notification.sendNotificationToAllUsers({
      title: 'New Package added',
      message: `A new package has been added: ${rest.Translation.find((t) => t.language === 'EN').name}`,
    });
    console.log(send);
    return new AppSuccess(offer, 'Package created successfully', 201);
  }

  async findAll(language: Language) {
    const fetchedPackages = await this.prisma.offers.findMany({
      where: { offerType: 'PACKAGES', NOT: { packages: null } },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        packages: {
          include: {
            ...Translation(),
            services: {
              include: {
                ...Translation(),
              },
            },
          },
        },
      },
    });
    const packages = fetchedPackages.map((packageData) => {
      const {
        createdAt,
        updatedAt,
        id,
        packages: { Translation: packageTrans, services: s, price, count },
      } = packageData;
      const services = s.map((s) => {
        const { Translation: serviceTrans, ...rest } = s;
        return {
          ...rest,
          nameEN: serviceTrans.find((t) => t.language === 'EN')?.name,
          nameAR: serviceTrans.find((t) => t.language === 'AR')?.name,
          name: serviceTrans.find((t) => t.language === language)?.name,
        };
      });
      return {
        id,
        price,
        count,
        nameEN: packageTrans.find((t) => t.language === 'EN')?.name,
        nameAR: packageTrans.find((t) => t.language === 'AR')?.name,
        name: packageTrans.find((t) => t.language === language)?.name,
        description: packageTrans.find((t) => t.language === language)
          ?.description,
        createdAt,
        updatedAt,
        services,
      };
    });

    return new AppSuccess({ packages }, 'packages fetched successfully', 200);
  }

  async findOne(id: string, language: Language) {
    const fetchedPackage = await this.prisma.packages.findUnique({
      where: { id },
      include: {
        ...Translation(false, language),
        services: {
          select: {
            id: true,
            ...Translation(false, language),
            serviceImg: true,
          },
        },
      },
    });

    if (!fetchedPackage) new NotFoundException('Package not found');

    const { Translation: t, services: s, ...rest } = fetchedPackage;
    const services = s.map((s) => {
      const { Translation, ...rest } = s;
      return {
        ...rest,
        name: Translation[0].name,
      };
    });

    const packageData = {
      ...rest,
      name: t[0].name,
      services,
    };

    return new AppSuccess(packageData, 'Package fetched successfully');
  }

  update(id: string) {
    return `This action updates a #${id} package`;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeExpiredPackages() {
    const result = await this.prisma.packages.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    const resultOffer = await this.prisma.packages.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.length > 0 || resultOffer.length > 0) {
      await this.prisma.packages.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      await this.prisma.offers.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    }
  }

  async remove() {
    await this.prisma.packages.deleteMany();

    return `This action removes a package`;
  }
}
