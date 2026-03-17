import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@Injectable()
export class NotificationCreateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(dto: CreateNotificationDto, file?: Express.Multer.File) {
    let imageUrl: string | undefined;
    let publicId: string | undefined;

    if (file) {
      const uploaded = await this.cloudinary.upload(file.buffer, 'notifications');
      imageUrl = uploaded.url;
      publicId = uploaded.publicId;
    }

    let users: { id: string }[];

    if (dto.userIds && dto.userIds.length > 0) {
      users = dto.userIds.map((id) => ({ id }));
    } else {
      users = await this.prisma.user.findMany({
        where: { deleted: false },
        select: { id: true },
      });
    }

    try {
      return await this.prisma.notification.create({
        data: {
          title: dto.title,
          content: dto.content,
          image: imageUrl,
          user: { connect: users },
        },
      });
    } catch (err) {
      if (publicId) await this.cloudinary.delete(publicId);
      throw err;
    }
  }
}
