import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language, Service } from 'generated/prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AppSuccess } from 'src/utils/AppSuccess';
import {
  createTranslation,
  Translation as serviceTranslation,
  updateTranslation,
} from '../../src/class-type/translation';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  public async getAllService(
    language: Language,
  ): Promise<AppSuccess<{ services: Service[] }>> {
    const fetchedServices = await this.prisma.service.findMany({
      where: { available: true },
      include: serviceTranslation(),
    });

    const services = fetchedServices.map((service) => {
      const { translation, ...rest } = service;

      return {
        ...rest,
        nameEN: translation.find((t) => t.language === 'EN')?.name,
        nameAR: translation.find((t) => t.language === 'AR')?.name,
        name: translation.find((t) => t.language === language)?.name,
      };
    });

    return new AppSuccess({ services }, 'Services found successfully');
  }

  public async getServiceById(
    id: string,
    language: Language,
  ): Promise<AppSuccess<Service>> {
    const service = await this.findOneOrFail(id, language);

    return new AppSuccess(service, 'Service found successfully');
  }

  public async createService(
    createServiceDto: CreateServiceDto,
    file: Express.Multer.File,
    language: Language,
  ): Promise<AppSuccess<Service>> {
    const serviceImg = file?.path;

    const newService = await this.prisma.service.create({
      data: {
        ...createServiceDto,
        ...(serviceImg && { serviceImg }),
        translation: createTranslation(createServiceDto),
      },
      include: serviceTranslation(false),
    });

    const { translation, ...rest } = newService;

    const service = {
      ...rest,
      nameEN: translation.find((t) => t.language === 'EN')?.name,
      nameAR: translation.find((t) => t.language === 'AR')?.name,
      name: translation.find((t) => t.language === language)?.name,
    };

    return new AppSuccess(service, 'Service created successfully');
  }

  public async updateService(
    id: string,
    updateServiceDto: UpdateServiceDto,
    file: Express.Multer.File,
    language: Language,
  ): Promise<AppSuccess<Service>> {
    await this.findOneOrFail(id);
    const serviceImg = file?.path;

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: {
        ...updateServiceDto,
        ...(serviceImg && { serviceImg }),
        ...(updateServiceDto.translation && {
          translation: updateTranslation(updateServiceDto),
        }),
      },
      include: serviceTranslation(false),
    });

    const { translation, ...rest } = updatedService;

    const service = {
      ...rest,
      nameEN: translation.find((t) => t.language === 'EN')?.name,
      nameAR: translation.find((t) => t.language === 'AR')?.name,
      name: translation.find((t) => t.language === language)?.name,
    };

    return new AppSuccess(service, 'Service updated successfully');
  }

  public async softDeleteService(
    id: string,
    available: { available: boolean },
  ): Promise<AppSuccess<Service>> {
    await this.findOneOrFail(id);
    const service = await this.prisma.service.update({
      where: { id },
      data: available,
    });

    return new AppSuccess(service, 'Service deleted successfully');
  }

  private async findOneOrFail(
    id: string,
    language?: Language,
  ): Promise<Service> {
    const fetchedService = await this.prisma.service.findUnique({
      where: { id, available: true },
      include: serviceTranslation(false),
    });
    if (!fetchedService) {
      throw new NotFoundException('Service not found');
    }
    const { translation, ...rest } = fetchedService;

    const service = {
      ...rest,
      nameEN: translation.find((t) => t.language === 'EN')?.name,
      nameAR: translation.find((t) => t.language === 'AR')?.name,
      name: translation.find((t) => t.language === language)?.name,
    };

    return service;
  }
}
