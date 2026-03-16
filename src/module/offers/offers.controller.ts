// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   UploadedFile,
//   UseGuards,
// } from '@nestjs/common';
// import { OffersService } from './offers.service';
// import { CreateOfferDto } from './dto/create-offer.dto';
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { PermissionGuard } from '@/common/guards/permission.guard';
// import { Permissions } from '@/common/decorators/permissions.decorator';
// import { CurrentUser } from '@/common/decorators/current-user.decorator';
// import { OffersSwagger } from './offers.swagger';
// import { UploadFile } from '@/common/decorators/upload.decorator';
// import { type User } from 'generated/prisma/client';

// @Controller('offers')
// export class OffersController {
//   constructor(private readonly offersService: OffersService) {}

//   @OffersSwagger.findAll()
//   @Get()
//   findAll() {
//     return this.offersService.findAll();
//   }

//   @OffersSwagger.findOne()
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.offersService.findOne(id);
//   }

//   @OffersSwagger.create()
//   @UploadFile('image')
//   @Post()
//   @UseGuards(JwtAuthGuard, PermissionGuard)
//   @Permissions('create:offers')
//   create(
//     @Body() dto: CreateOfferDto,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     return this.offersService.create(dto, file);
//   }

//   @OffersSwagger.buy()
//   @Post(':id/buy')
//   @UseGuards(JwtAuthGuard, PermissionGuard)
//   @Permissions('buy:offers')
//   buy(@Param('id') id: string, @CurrentUser() user: User) {
//     return this.offersService.buy(id, user.id);
//   }

//   @OffersSwagger.remove()
//   @Delete(':id')
//   @UseGuards(JwtAuthGuard, PermissionGuard)
//   @Permissions('delete:offers')
//   remove(@Param('id') id: string) {
//     return this.offersService.remove(id);
//   }
// }
