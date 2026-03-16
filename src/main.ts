import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as express from 'express';
import { join } from 'path';
import { FirstErrorOnlyFilter } from '../filters/validation-fields-only.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const isDev = process.env.NODE_ENV === 'development';
  const devApiKey =
    isDev && Buffer.from(process.env.API_KEY || '').toString('base64');

  const config = new DocumentBuilder()
    .setTitle('Naeman API')
    .setDescription('Barber booking system API')
    .setVersion('1.0')
    .addBearerAuth()
    // .addApiKey(
    //   {
    //     name: 'x-api-key',
    //     in: 'header',
    //     description: 'API key for authentication (dev only)',
    //     type: 'apiKey',
    //   },
    //   'x-api-key',
    // )
    // .addApiKey(
    //   {
    //     name: 'Accept-Language',
    //     in: 'header',
    //     description: 'Language for response messages (en or ar)',
    //     type: 'apiKey',
    //   },
    //   'Accept-Language',
    // )
    // .addSecurityRequirements('Accept-Language')
    // .addSecurityRequirements('x-api-key')
    .build();

  app.use((req: Request, res, next) => {
    if (!isDev) req.headers['x-api-key'] = devApiKey;
    req.headers['Accept-Language'] = 'en';
    next();
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Docs',
    customfavIcon:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/favicon-32x32.png',
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
    ],
  });

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
    console.log(
      `swagger is running on: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
    );
  });
}

bootstrap();
