import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const lang = this.extractLanguage(req);
    const messageKey = this.extractMessageKey(exception);
    const status = exception.getStatus ? exception.getStatus() : 500;

    const i18nKey = messageKey.startsWith('common.')
      ? messageKey
      : `common.${messageKey}`;

    let message: string;
    try {
      message = await this.i18n.translate(i18nKey, { lang });
      if (message === i18nKey || message === messageKey) message = messageKey;
    } catch (error) {
      console.log(error);
      message = messageKey;
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
  private extractMessageKey(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && response && 'message' in response) {
        return String(response.message) || exception.message;
      }
      return exception.message;
    }

    // For non-HttpException errors
    if (exception instanceof Error) return exception.message;

    // For unknown error types, try to extract message safely
    if (exception && typeof exception === 'object' && 'message' in exception) {
      return String(exception.message) || 'INTERNAL_SERVER_ERROR';
    }

    return 'INTERNAL_SERVER_ERROR';
  }
  private extractLanguage(request: Request): string {
    const lang =
      request.headers['x-lang'] ||
      request.headers['accept-language'] ||
      request.headers['Accept-Language'] ||
      request.query.lang;

    if (typeof lang === 'string') {
      return lang
        .split(',')[0]
        .split('-')[0]
        .split(';')[0]
        .trim()
        .toLowerCase();
    }

    return 'en'; // default language
  }
}
