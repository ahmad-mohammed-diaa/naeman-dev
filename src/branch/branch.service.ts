import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppSuccess } from 'src/utils/AppSuccess';
import { Branch, CategoryType, Language } from '@prisma/client';
import {
  createTranslation,
  Translation,
  updateTranslation,
} from '../../src/class-type/translation';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBranchDto: CreateBranchDto,
    file: Express.Multer.File,
  ): Promise<AppSuccess<Branch>> {
    const branchImg = file?.path;

    const newBranch = await this.prisma.branch.create({
      data: {
        ...(branchImg && { branchImg }),
        ...createBranchDto,
        latitude: createBranchDto.latitude.toString(),
        longitude: createBranchDto.longitude.toString(),
        Translation: createTranslation(createBranchDto),
      },
      include: Translation(),
    });

    const { Translation: branchTranslation, ...rest } = newBranch;

    const branch = {
      name: branchTranslation[0].name,
      ...rest,
    };

    return new AppSuccess(branch, 'Branch created successfully');
  }

  async findAll(
    language: Language,
  ): Promise<AppSuccess<{ branches: Branch[] }>> {
    const fetchBranches = await this.prisma.branch.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { ...Translation(), barber: true },
    });

    const maxDaysBooking = await this.prisma.settings
      .findFirst()
      .then((s) => s?.maxDaysBooking);
    const branches = fetchBranches.map((branch) => {
      const { Translation, ...rest } = branch;
      return {
        ...rest,
        nameEN: Translation.find((t) => t.language === 'EN')?.name,
        nameAR: Translation.find((t) => t.language === 'AR')?.name,
        name: Translation.find((t) => t.language === language)?.name,
        maxDaysBooking,
      };
    });

    return new AppSuccess({ branches }, 'Branches found successfully');
  }

  async findOne(
    id: string,
    type?: CategoryType,
    DateTime?: string,
    language?: Language,
  ): Promise<AppSuccess<Branch>> {
    const targetDate = DateTime ? new Date(DateTime) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const fetchedBranch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        ...Translation(false, language),
        barber: {
          where: { type },
          select: {
            id: true,
            rate: true,
            type: true,
            user: {
              select: {
                id: false,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
        Cashier: {
          select: {
            id: true,
            user: {
              select: {
                id: false,
                firstName: true,
                lastName: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!fetchedBranch)
      throw new NotFoundException(`Branch with ID ${id} not found`);

    const {
      Translation: branchTranslation,

      ...rest
    } = fetchedBranch;

    const branch = {
      ...rest,
      name: branchTranslation[0].name,
      maxDaysBooking: await this.prisma.settings
        .findFirst()
        .then((s) => s?.maxDaysBooking),
    };

    return new AppSuccess(branch, 'Branch found successfully');
  }

  async update(
    id: string,
    updateBranchDto: UpdateBranchDto,
    file: Express.Multer.File,
  ): Promise<AppSuccess<Branch>> {
    await this.findOne(id);

    const branchImg = file?.path;

    const updatedBranch = await this.prisma.branch.update({
      where: { id },
      data: {
        ...updateBranchDto,
        ...(branchImg && { branchImg }),
        ...(updateBranchDto.Translation && {
          Translation: updateTranslation(updateBranchDto),
        }),
      },
    });
    return new AppSuccess(updatedBranch, 'Branch updated successfully');
  }

  async remove(id: string) {
    return `This action removes a #${id} branch`;
  }
}
