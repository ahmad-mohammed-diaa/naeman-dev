import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../exceptions/app.exception';

const USER_BASE_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatar: true,
  roleRef: { select: { name: true } },
} as const;

export const SLOT_SELECT = {
  id: true,
  start: true,
  end: true,
  // slot: true,
} as const;

export const BARBER_SELECT = {
  branchId: true,
  rate: true,
  isAvailable: true,
  type: true,
  vacations: true,
  slot: { select: SLOT_SELECT },
  user: { select: USER_BASE_SELECT },
} as const;

export const CASHIER_SELECT = {
  id: true,
  branchId: true,
  vacations: true,
  slot: { select: SLOT_SELECT },
  user: { select: USER_BASE_SELECT },
} as const;

export const CLIENT_SELECT = {
  id: true,
  referralCode: true,
  points: true,
  ban: true,
  canceledOrders: true,
  user: { select: USER_BASE_SELECT },
} as const;

export function flattenUser<T extends { user: object }>(
  record: T,
): Omit<T, 'user'> & T['user'] & { role: string } {
  const { user, ...rest } = record;
  const { role, ...userRest } = user as { role: string };
  return { ...userRest, role, ...rest };
}

export type BarberExtra = 'slot' | 'vacations';
export type CashierExtra = 'slot' | 'vacations';
export type ClientExtra =
  | 'clientPackages'
  | 'complain'
  | 'barberRating'
  | 'pointTransaction';

export async function getBarber(
  prisma: PrismaService,
  id: string,
  extras?: BarberExtra[],
) {
  const ex = extras ?? [];
  const barber = await prisma.barber.findUnique({
    where: { id },
    select: {
      user: {
        select: {
          id: true,
          role: true,
          roleRef: true,
          firstName: true,
          lastName: true,
          admin: true,
        },
      },
      ...BARBER_SELECT,
      slot: ex.includes('slot'),
      vacations: ex.includes('vacations'),
    },
  });
  if (!barber) throw new AppNotFoundException('NOT_FOUND_BARBER');
  return flattenUser(barber);
}

export async function getCashier(
  prisma: PrismaService,
  id: string,
  extras?: CashierExtra[],
) {
  const ex = extras ?? [];
  const cashier = await prisma.cashier.findUnique({
    where: { id },
    select: {
      ...CASHIER_SELECT,
      slot: ex.includes('slot'),
      vacations: ex.includes('vacations'),
    },
  });
  if (!cashier) throw new AppNotFoundException('NOT_FOUND_CASHIER');
  return flattenUser(cashier);
}

export async function getClient(
  prisma: PrismaService,
  id: string,
  extras?: ClientExtra[],
) {
  const ex = extras ?? [];
  const client = await prisma.client.findUnique({
    where: { id },
    select: {
      ...CLIENT_SELECT,

      ...(ex.includes('complain') && { complain: true }),
      ...(ex.includes('barberRating') && { barberRating: true }),
      ...(ex.includes('pointTransaction') && { pointTransaction: true }),
      ...(ex.includes('clientPackages') && {
        clientPackages: {
          where: { isActive: true },
          include: { packageService: { include: { service: true } } },
        },
      }),
    },
  });
  if (!client) throw new AppNotFoundException('NOT_FOUND_CLIENT');
  return flattenUser(client);
}

export async function getAdmin(prisma: PrismaService, id: string) {
  const user = await prisma.user.findUnique({
    where: { id, deleted: false },
    select: { ...USER_BASE_SELECT },
  });
  if (!user) throw new AppNotFoundException('NOT_FOUND_USER');
  return user;
}
