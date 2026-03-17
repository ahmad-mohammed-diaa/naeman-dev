import { PartialType } from '@nestjs/swagger';
import { CreateClientPackageDto } from './create-client-package.dto';

export class UpdateClientPackageDto extends PartialType(
  CreateClientPackageDto,
) {}
