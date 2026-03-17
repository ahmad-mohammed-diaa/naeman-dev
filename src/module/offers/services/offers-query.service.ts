// import { Injectable } from '@nestjs/common';
// import { I18nContext } from 'nestjs-i18n';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { AppNotFoundException } from '../../../common/exceptions/app.exception';
// import {
//   deepMapWithTranslation,
//   parseLang,
// } from '../../../common/helpers/translation.helper';

// @Injectable()
// export class OffersQueryService {
//   constructor(private readonly prisma: PrismaService) {}

//   async findAll() {
//     const lang = parseLang(I18nContext.current()?.lang);
//     const raw = await this.prisma.offers.findMany({
//       include: {
//         packages: { include: { translation: true, services: true } },
//         points: { include: { translation: true } },
//       },
//       where: { expiresAt: { gt: new Date() } },
//     });
//     return deepMapWithTranslation(raw, lang);
//   }

//   async findOne(id: string) {
//     const lang = parseLang(I18nContext.current()?.lang);
//     const offer = await this.prisma.offers.findUnique({
//       where: { id },
//       include: {
//         packages: { include: { translation: true, services: true } },
//         points: { include: { translation: true } },
//       },
//     });
//     if (!offer) throw new AppNotFoundException('NOT_FOUND_OFFER');
//     return deepMapWithTranslation(offer, lang);
//   }
// }
