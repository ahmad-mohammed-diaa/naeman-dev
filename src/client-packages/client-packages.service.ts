import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateClientPackageDto } from './dto/update-client-package.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Language, User } from 'generated/prisma/client';
import { AppSuccess } from 'src/utils/AppSuccess';
import {
  createTranslation,
  Translation,
  translationDes,
} from '../../src/class-type/translation';

@Injectable()
export class ClientPackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(packageId: string, phone: string, language: Language) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user)
      throw new NotFoundException(`User with phone ${phone} not found`);

    const pkg = await this.prisma.packages.findFirst({
      where: { id: packageId },
      include: { services: true, ...translationDes() },
    });

    if (!pkg) {
      throw new NotFoundException(`the Package you choose not found`);
    }

    const clientPackageExists = await this.prisma.clientPackages.findFirst({
      where: { packageId: pkg.id, clientId: user.id },
    });

    if (clientPackageExists) {
      throw new NotFoundException('You already have this package');
    }

    const clientPackage = await this.prisma.client.update({
      where: { id: user.id },
      data: {
        clientPackages: {
          create: {
            translation: createTranslation(pkg),
            packageId: pkg.id,
            type: pkg.type,
            packageService: {
              createMany: {
                data: pkg.services.map((service) => ({
                  serviceId: service.id,
                  quantity: pkg.count,
                })),
              },
            },
          },
        },
      },
      include: {
        clientPackages: {
          select: {
            id: true,
            packageService: {
              include: {
                service: {
                  include: Translation(false, language),
                },
              },
            },
          },
        },
      },
    });

    return new AppSuccess(
      clientPackage,
      'Client package created successfully',
      201,
    );
  }

  async findAll(language: Language) {
    const fetchedClientPackages = await this.prisma.clientPackages.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        translation: {
          where: { language },
          ...translationDes().translation,
        },
        packageService: {
          include: {
            service: {
              include: {
                translation: {
                  where: { language },
                  ...Translation().translation,
                },
              },
            },
          },
        },
      },
    });

    const clientPackages = fetchedClientPackages.map((clientPackage) => {
      const { translation, packageService, ...rest } = clientPackage;
      return {
        ...rest,
        nameEN: translation.find((t) => t.language === 'EN')?.name,
        nameAR: translation.find((t) => t.language === 'AR')?.name,
        name: translation.find((t) => t.language === language)?.name,
        description: translation.find((t) => t.language === language)
          .description,
        services: packageService.map((service) => {
          const { serviceImg, translation, ...rest } = service.service;
          return {
            ...rest,
            nameEN: translation.find((t) => t.language === 'EN')?.name,
            nameAR: translation.find((t) => t.language === 'AR')?.name,
            name: translation.find((t) => t.language === language)?.name,
            serviceImg,
          };
        }),
      };
    });

    return new AppSuccess(
      { clientPackages },
      'Client packages fetched successfully',
      200,
    );
  }

  async findOne(id: string, language: Language) {
    const fetchedClientPackage = await this.prisma.clientPackages.findUnique({
      where: { id: id },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        translation: {
          where: { language },
          ...translationDes().translation,
        },
        packageService: {
          include: {
            service: {
              select: {
                id: true,
                translation: {
                  where: { language },
                  ...Translation().translation,
                },
                serviceImg: true,
              },
            },
          },
        },
      },
    });

    const {
      translation: clientPackageTranslation,
      packageService,
      ...rest
    } = fetchedClientPackage;

    const clientPackage = {
      ...rest,
      name: clientPackageTranslation[0].name,
      description: clientPackageTranslation[0].description,
      translation: clientPackageTranslation,
      services: packageService.map((service) => {
        const { serviceImg, translation, ...rest } = service.service;
        return {
          ...rest,
          name: translation[0].name,
          serviceImg,
        };
      }),
    };

    if (!clientPackage) {
      throw new NotFoundException(`Client package with ID ${id} not found`);
    }

    return new AppSuccess(
      { clientPackage },
      'Client package fetched successfully',
      200,
    );
  }

  update(id: number) {
    return `This action updates a #${id} clientPackage`;
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.packagesServices.deleteMany({
        where: { clientPackagesId: id },
      });

      await prisma.clientPackages.delete({
        where: { id },
      });

      return 'deleted';
    });
  }
}
