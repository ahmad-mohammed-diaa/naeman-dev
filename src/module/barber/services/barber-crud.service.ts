import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateBarberDto } from '../dto/create-barber.dto';
import { RateBarberDto } from '../dto/rate-barber.dto';
import { SetAvailabilityDto } from '../dto/set-availability.dto';
import {
  BARBER_SELECT,
  flattenUser,
  getBarber,
} from '../../../common/helpers/user.helper';

export { BARBER_SELECT };

@Injectable()
export class BarberCrudService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(branchId?: string, includeUnavailable?: boolean) {
    const barbers = await this.prisma.barber.findMany({
      where: {
        ...(branchId && { branchId }),
        ...(!includeUnavailable && { isAvailable: true }),
      },
      select: BARBER_SELECT,
    });
    return barbers.map(flattenUser);
  }

  findOne(id: string) {
    return getBarber(this.prisma, id, ['slot', 'vacations']);
  }

  async update(id: string, dto: UpdateBarberDto) {
    await getBarber(this.prisma, id); // validates existence
    const { vacations, ...rest } = dto;
    const barber = await this.prisma.barber.update({
      where: { id },
      data: {
        ...rest,
        // ...(vacations !== undefined && { vacations }),
      },
      select: BARBER_SELECT,
    });
    return flattenUser(barber);
  }

  async setAvailability(id: string, dto: SetAvailabilityDto) {
    await getBarber(this.prisma, id);
    const barber = await this.prisma.barber.update({
      where: { id },
      data: { isAvailable: dto.isAvailable },
      select: BARBER_SELECT,
    });
    return flattenUser(barber);
  }

  async rate(barberId: string, clientId: string, dto: RateBarberDto) {
    await getBarber(this.prisma, barberId);

    await this.prisma.barberRating.upsert({
      where: { barberId_clientId: { barberId, clientId } },
      create: { barberId, clientId, rate: dto.rate },
      update: { rate: dto.rate },
    });

    // Recalculate average
    const { _avg } = await this.prisma.barberRating.aggregate({
      where: { barberId },
      _avg: { rate: true },
    });

    await this.prisma.barber.update({
      where: { id: barberId },
      data: { rate: _avg.rate ?? 0 },
    });

    return { message: 'Rating submitted' };
  }
}
