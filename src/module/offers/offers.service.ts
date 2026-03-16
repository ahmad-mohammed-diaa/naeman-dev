// import { Injectable } from '@nestjs/common';
// import { CreateOfferDto } from './dto/create-offer.dto';
// import { OffersQueryService } from './services/offers-query.service';
// import { OffersManageService } from './services/offers-manage.service';

// @Injectable()
// export class OffersService {
//   constructor(
//     private readonly query: OffersQueryService,
//     private readonly manage: OffersManageService,
//   ) {}

//   findAll() { return this.query.findAll(); }
//   findOne(id: string) { return this.query.findOne(id); }
//   create(dto: CreateOfferDto, file?: Express.Multer.File) { return this.manage.create(dto, file); }
//   buy(offerId: string, clientId: string) { return this.manage.buy(offerId, clientId); }
//   remove(id: string) { return this.manage.remove(id); }
// }
