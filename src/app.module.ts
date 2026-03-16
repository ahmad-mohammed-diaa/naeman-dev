import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { OrderModule } from './order/order.module';
import { BranchModule } from './branch/branch.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenService } from './token.service';
import { ComplainModule } from './complain/complain.module';
import { ConfigModule } from '@nestjs/config';
import { PointsModule } from './points/points.module';
import { MockModule } from './mock/mock.module';
import { PackageModule } from './package/package.module';
import { ClientPackagesModule } from './client-packages/client-packages.module';
import { PaymobModule } from './paymob/paymob.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { StaticModule } from './static/static.module';
import { AdminModule } from './admin/admin.module';
import { SmsModule } from './sms/sms.module';

// V2 modules
import {
  AuthModuleV2,
  BranchModuleV2,
  BarberModuleV2,
  CategoryModuleV2,
  CashierModuleV2,
  ClientModuleV2,
  NotificationModuleV2,
  OrderModuleV2,
  PromoCodeModuleV2,
  PointsModuleV2,
  ProductModuleV2,
  SettingsModuleV2,
  StaticModuleV2,
  ServiceModuleV2,
  SlotModuleV2,
  UserModuleV2,
} from './module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // V1 modules
    AuthModule,
    UserModule,
    PrismaModule,
    PackageModule,
    CategoryModule,
    ServiceModule,
    OrderModule,
    BranchModule,
    PromoCodeModule,
    ScheduleModule.forRoot(),
    ComplainModule,
    ClientPackagesModule,
    PointsModule,
    PaymobModule,
    NotificationModule,
    MockModule,
    ProductModule,
    StaticModule,
    AdminModule,
    SmsModule,
    // V2 modules
    AuthModuleV2,
    BranchModuleV2,
    BarberModuleV2,
    CategoryModuleV2,
    CashierModuleV2,
    ClientModuleV2,
    NotificationModuleV2,
    OrderModuleV2,
    PromoCodeModuleV2,
    PointsModuleV2,
    ProductModuleV2,
    SettingsModuleV2,
    StaticModuleV2,
    ServiceModuleV2,
    SlotModuleV2,
    UserModuleV2,

    //Common
    CloudinaryModule,
  ],
  controllers: [],
  providers: [TokenService],
})
export class AppModule {}
