// import { Injectable } from '@nestjs/common';
// import { I18nContext } from 'nestjs-i18n';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { OffersQueryService } from './offers-query.service';
// import { CreateOfferDto } from '../dto/create-offer.dto';
// import { CloudinaryService } from '@/common/cloudinary/cloudinary.service';
// import {
//   AppBadRequestException,
//   AppNotFoundException,
// } from '@/common/exceptions/app.exception';
// import { OfferType, PointTransactionType } from 'generated/prisma/enums';
// import {
//   deepMapWithTranslation,
//   parseLang,
// } from '@/common/helpers/translation.helper';

// @Injectable()
// export class OffersManageService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly query: OffersQueryService,
//     private readonly cloudinary: CloudinaryService,
//   ) {}

//   async create(dto: CreateOfferDto, file?: Express.Multer.File) {
//     const lang = parseLang(I18nContext.current()?.lang);

//     // ── Validate type-specific fields BEFORE upload ────────────────────────
//     let packageCreateData: Record<string, unknown> | undefined;
//     if (dto.offerType === OfferType.PACKAGES) {
//       packageCreateData = await this._buildPackageData(dto);
//     }

//     // ── Upload image AFTER all validation passes ───────────────────────────
//     let imageUrl = '';
//     let imagePublicId: string | undefined;
//     if (file) {
//       const result = await this.cloudinary.upload(file.buffer, 'offers');
//       imageUrl = result.url;
//       imagePublicId = result.publicId;
//     }

//     try {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const createData: any = {
//         expiresAt: new Date(dto.expiresAt),
//         offerType: dto.offerType,
//       };

//       if (dto.offerType === OfferType.PACKAGES && packageCreateData) {
//         createData.packages = {
//           create: { ...packageCreateData, image: imageUrl },
//         };
//       } else if (dto.offerType === OfferType.POINTS) {
//         createData.points = {
//           create: {
//             image: imageUrl,
//             price: dto.price,
//             points: dto.pointsAmount!,
//             expiresAt: new Date(dto.expiresAt),
//             translation: {
//               create: dto.translations.map((t) => ({
//                 name: t.name,
//                 description: t.description,
//                 language: t.language,
//               })),
//             },
//           },
//         };
//       }

//       const raw = await this.prisma.offers.create({
//         data: createData,
//         include: {
//           packages: { include: { translation: true, services: true } },
//           points: { include: { translation: true } },
//         },
//       });

//       return deepMapWithTranslation(raw, lang);
//     } catch (err) {
//       if (imagePublicId) await this.cloudinary.delete(imagePublicId);
//       throw err;
//     }
//   }

//   async buy(offerId: string, clientId: string) {
//     const offer = await this.prisma.offers.findUnique({
//       where: { id: offerId },
//       include: { packages: { include: { services: true } }, points: true },
//     });
//     if (!offer) throw new AppNotFoundException('NOT_FOUND_OFFER');
//     if (offer.expiresAt < new Date())
//       throw new AppBadRequestException('OFFER_EXPIRED');
//     const { points, packages, offerType } = offer;
//     if (offerType === OfferType.PACKAGES && packages) {
//       return this.prisma.clientPackage.create({
//         data: {
//           clientId,
//           packageId: packages.id,
//           expiresAt: packages.expiresAt,
//           packageService: {
//             createMany: {
//               data: packages.services.map((s) => ({
//                 quantity: 1,
//                 serviceId: s.id,
//               })),
//             },
//           },
//         },
//         include: { packageService: true },
//       });
//     }

//     if (offerType === OfferType.POINTS && points) {
//       const amount = points.points;
//       const [transaction] = await this.prisma.$transaction([
//         this.prisma.pointTransaction.create({
//           data: { clientId, type: PointTransactionType.EARN, amount },
//         }),
//         this.prisma.client.update({
//           where: { id: clientId },
//           data: { points: { increment: amount } },
//         }),
//       ]);
//       return transaction;
//     }

//     throw new AppBadRequestException('OFFER_INVALID_TYPE');
//   }

//   async remove(id: string) {
//     await this.query.findOne(id);
//     await this.prisma.offers.delete({ where: { id } });
//     return { message: 'Offer deleted' };
//   }

//   private async _buildPackageData(dto: CreateOfferDto) {
//     const services = await this.prisma.service.findMany({
//       where: { id: { in: dto.serviceIds }, available: true },
//     });
//     if (services.length !== dto.serviceIds!.length)
//       throw new AppBadRequestException('PACKAGE_SERVICE_INVALID');

//     const originalPrice = services.reduce((acc, s) => acc + s.price, 0);

//     return {
//       price: dto.price,
//       originalPrice,
//       expiresAt: new Date(dto.expiresAt),
//       services: { connect: dto.serviceIds!.map((id) => ({ id })) },
//       translation: {
//         create: dto.translations.map((t) => ({
//           name: t.name,
//           description: t.description,
//           language: t.language,
//         })),
//       },
//     };
//   }
// }
