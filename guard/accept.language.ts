import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AcceptLanguage implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const lang = req.headers['accept-language'] || 'EN';
    return lang;
  }
  catch(error) {
    throw new UnauthorizedException('Invalid ');
  }
}
