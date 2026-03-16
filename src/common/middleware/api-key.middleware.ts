import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const apiKeyHeader = req.headers['x-api-key'] as string | undefined;
    console.log(apiKeyHeader);
    if (!apiKeyHeader) throw new UnauthorizedException('Missing API key');

    const decoded = Buffer.from(apiKeyHeader, 'base64').toString('utf-8');
    if (decoded !== process.env.API_KEY)
      throw new UnauthorizedException('Invalid API key');

    next();
  }
}
