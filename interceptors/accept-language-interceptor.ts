import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AcceptLanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.language = request.headers['accept-language'] || 'EN';
    return next.handle().pipe(
      map((data) => {
        return { ...data, language: request.language };
      }),
    );
  }
}
