import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as express from 'express';
import { join } from 'path';
import { FirstErrorOnlyFilter } from '../filters/validation-fields-only.filter';
import { SwaggerVersions } from './swagger.version';

// V1 modules

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(express.static(join(__dirname, '..', 'public')));
  const prismaService = app.get(PrismaService);
  await prismaService.onModuleInit();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new FirstErrorOnlyFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      whitelist: true,
      exceptionFactory: (data) => {
        return new BadRequestException(data);
      },
    }),
  );

  // app.enableVersioning({
  //   type: 'URI',
  // });
  SwaggerVersions(app);

  const isDev = process.env.NODE_ENV === 'development';
  const devApiKey =
    isDev && Buffer.from(process.env.API_KEY || '').toString('base64');

  app.use((req: Request, res, next) => {
    if (!isDev) req.headers['x-api-key'] = devApiKey;
    req.headers['Accept-Language'] = 'en';
    next();
  });

  // --- V1 Swagger ---

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0', () => {
    console.log(`Application is running on port: ${process.env.PORT ?? 3000}`);
    console.log(`Swagger v1: ${process.env.PORT ?? 3000}/api/docs/v1`);
    console.log(`Swagger v2: ${process.env.PORT ?? 3000}/api/docs/v2`);
  });
}

bootstrap();
