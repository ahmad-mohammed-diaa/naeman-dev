import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ServiceModule } from './service/service.module';
import { OrderModule } from './order/order.module';
import { BranchModule } from './branch/branch.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { ComplainModule } from './complain/complain.module';
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
// import {
//     AuthModuleV2,
//   BranchModuleV2,
//   BarberModuleV2,
//   CategoryModuleV2,
//   CashierModuleV2,
//   ClientModuleV2,
//   NotificationModuleV2,
//   OrderModuleV2,
//   PromoCodeModuleV2,
//   PointsModuleV2,
//   ProductModuleV2,
//   SettingsModuleV2,
//   StaticModuleV2,
//   ServiceModuleV2,
//   SlotModuleV2,
//   UserModuleV2,
// } from './module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

const swaggerUiOptions = {
  customfavIcon:
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/favicon-32x32.png',
  //   customCssUrl:
  //     'https://cdn.jsdelivr.net/gh/Amoenus/SwaggerDark/SwaggerDark.css',
  customJs: [
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
  ],
};
export function SwaggerVersions(app: INestApplication<any>) {
  const v1Config = new DocumentBuilder()
    .setTitle('Naeman API v1')
    .setDescription('Legacy barber booking system API (v1)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const v1Document = SwaggerModule.createDocument(app, v1Config, {
    include: [
      AuthModule,
      UserModule,
      CategoryModule,
      ServiceModule,
      OrderModule,
      BranchModule,
      PromoCodeModule,
      ComplainModule,
      PointsModule,
      MockModule,
      PackageModule,
      ClientPackagesModule,
      PaymobModule,
      NotificationModule,
      ProductModule,
      StaticModule,
      AdminModule,
      SmsModule,
    ],
  });

  // --- V2 Swagger ---
  const v2Config = new DocumentBuilder()
    .setTitle('Naeman API v2')
    .setDescription('Barber booking system API (v2)')
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  //   const v2Document = SwaggerModule.createDocument(app, v2Config, {
  //     include: [
  //       //   AuthModuleV2,
  //       BranchModuleV2,
  //       BarberModuleV2,
  //       CategoryModuleV2,
  //       CashierModuleV2,
  //       ClientModuleV2,
  //       NotificationModuleV2,
  //       OrderModuleV2,
  //       PromoCodeModuleV2,
  //       PointsModuleV2,
  //       ProductModuleV2,
  //       SettingsModuleV2,
  //       StaticModuleV2,
  //       ServiceModuleV2,
  //       SlotModuleV2,
  //       UserModuleV2,
  //     ],
  //   });

  SwaggerModule.setup('api/docs', app, v1Document, {
    ...swaggerUiOptions,
    explorer: true, // 👈 this enables the dropdown
    swaggerOptions: {
      urls: [
        {
          url: '/api/docs-json?v=1',
          name: 'v1',
        },
        {
          url: '/api/docs-json?v=2',
          name: 'v2',
        },
      ],
    },
  });

  app.getHttpAdapter().get('/api/docs-json', (req, res) => {
    const version = req.query.v;

    // if (version === '2') {
    //   return res.json(v2Document);
    // }

    return res.json(v1Document);
  });
}
