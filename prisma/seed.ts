import { PrismaClient, Role } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Permission definitions ────────────────────────────────────────────────

const ALL_PERMISSIONS: { action: string; resource: string }[] = [
  // orders
  { action: 'view', resource: 'orders' },
  { action: 'create', resource: 'orders' },
  { action: 'edit', resource: 'orders' },
  { action: 'delete', resource: 'orders' },
  { action: 'mark:paid', resource: 'orders' },
  { action: 'mark:cancelled', resource: 'orders' },
  { action: 'mark:completed', resource: 'orders' },
  { action: 'mark:in-progress', resource: 'orders' },
  // services
  { action: 'view', resource: 'services' },
  { action: 'create', resource: 'services' },
  { action: 'edit', resource: 'services' },
  { action: 'delete', resource: 'services' },
  // categories
  { action: 'view', resource: 'categories' },
  { action: 'create', resource: 'categories' },
  { action: 'edit', resource: 'categories' },
  { action: 'delete', resource: 'categories' },
  // branches
  { action: 'view', resource: 'branches' },
  { action: 'create', resource: 'branches' },
  { action: 'edit', resource: 'branches' },
  { action: 'delete', resource: 'branches' },
  // barbers
  { action: 'view', resource: 'barbers' },
  { action: 'create', resource: 'barbers' },
  { action: 'edit', resource: 'barbers' },
  { action: 'delete', resource: 'barbers' },
  // cashiers
  { action: 'view', resource: 'cashiers' },
  { action: 'create', resource: 'cashiers' },
  { action: 'edit', resource: 'cashiers' },
  { action: 'delete', resource: 'cashiers' },
  // clients
  { action: 'view', resource: 'clients' },
  { action: 'edit', resource: 'clients' },
  { action: 'delete', resource: 'clients' },
  // settings
  { action: 'view', resource: 'settings' },
  { action: 'edit', resource: 'settings' },
  // offers
  { action: 'view', resource: 'offers' },
  { action: 'create', resource: 'offers' },
  { action: 'edit', resource: 'offers' },
  { action: 'delete', resource: 'offers' },
  // packages
  { action: 'view', resource: 'packages' },
  { action: 'create', resource: 'packages' },
  { action: 'edit', resource: 'packages' },
  // points
  { action: 'view', resource: 'points' },
  // slots
  { action: 'view', resource: 'slots' },
  // notifications
  { action: 'view', resource: 'notifications' },
  { action: 'create', resource: 'notifications' },
  // complains
  { action: 'view', resource: 'complains' },
  { action: 'create', resource: 'complains' },
  // products
  { action: 'view', resource: 'products' },
  { action: 'create', resource: 'products' },
  { action: 'edit', resource: 'products' },
  // promo-codes
  { action: 'view', resource: 'promo-codes' },
  { action: 'create', resource: 'promo-codes' },
  // users
  { action: 'view', resource: 'users' },
  { action: 'create', resource: 'users' },
  { action: 'edit', resource: 'users' },
  { action: 'delete', resource: 'users' },
  // static
  { action: 'view', resource: 'static' },
  { action: 'create', resource: 'static' },
  { action: 'edit', resource: 'static' },
];

// ─── Per-role permission sets ──────────────────────────────────────────────

const BARBER_PERMISSIONS = [
  'view:orders',
  'edit:orders',
  'view:services',
  'view:categories',
  'view:branches',
  'view:barbers',
  'edit:barbers',
  'view:clients',
  'view:slots',
  'view:notifications',
];

const CASHIER_PERMISSIONS = [
  'view:orders',
  'create:orders',
  'edit:orders',
  'view:services',
  'view:categories',
  'view:branches',
  'view:barbers',
  'view:clients',
  'view:slots',
  'view:packages',
  'view:notifications',
];

const CLIENT_PERMISSIONS = [
  'view:orders',
  'create:orders',
  'view:services',
  'view:categories',
  'view:branches',
  'view:barbers',
  'view:offers',
  'view:packages',
  'view:slots',
  'view:points',
  'view:notifications',
  'view:complains',
  'create:complains',
  'view:products',
  'view:static',
];

// ─── Seed helpers ──────────────────────────────────────────────────────────

async function upsertPermissions() {
  await prisma.permission.createMany({
    data: ALL_PERMISSIONS,
    skipDuplicates: true,
  });

  console.log(`Permissions seeded or already exist`);
  console.log(`Seeded ${ALL_PERMISSIONS.length} permissions`);
}

async function upsertRole(name: string, permissionKeys: string[]) {
  const permissions = await prisma.permission.findMany({
    where: {
      OR: permissionKeys.map((key) => {
        const [action, resource] = key.split(':');
        return { action, resource };
      }),
    },
  });

  await prisma.roles.upsert({
    where: { name },
    update: {
      permissions: { set: permissions.map((p) => ({ id: p.id })) },
    },
    create: {
      name,
      permissions: { connect: permissions.map((p) => ({ id: p.id })) },
    },
  });

  console.log(`Seeded role: ${name} (${permissions.length} permissions)`);
}

async function upsertUser(role: Role) {
  const roles = await prisma.roles.findUnique({
    where: { name: role },
  });
  const users = await prisma.user.findMany({
    where: { role },
    select: { id: true, role: true },
  });
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { roleId: roles.id },
    });
  }
  console.log(`Seeded User role: ${role} (${users.length} Users)`);
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding database...');

  await upsertPermissions();

  // ADMIN gets all permissions
  const allKeys = ALL_PERMISSIONS.map((p) => `${p.action}:${p.resource}`);
  await upsertRole('ADMIN', allKeys);
  await upsertUser(Role.ADMIN);
  await upsertRole('BARBER', BARBER_PERMISSIONS);
  await upsertUser(Role.BARBER);
  await upsertRole('CASHIER', CASHIER_PERMISSIONS);
  await upsertUser(Role.CASHIER);
  await upsertRole('USER', CLIENT_PERMISSIONS);
  await upsertUser(Role.USER);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
