import { Language } from 'generated/prisma/enums';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator that extracts the language from the `accept-language` header.
 * Falls back to 'en' when the header is absent.
 *
 * Controller usage:
 *   findAll(@Lang() lang: string) { return this.service.findAll(lang); }
 *
 * For services that run WITHIN a request (no controller param needed):
 *   import { I18nContext } from 'nestjs-i18n';
 *   import { parseLang } from '@/common/helpers/translation.helper';
 *   const lang = parseLang(I18nContext.current()?.lang);
 */
export const Lang = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Language => {
    const req = ctx.switchToHttp().getRequest();
    const acceptLanguage =
      req.headers['accept-language'] || req.headers['Accept-Language'];
    console.log(acceptLanguage);
    return (acceptLanguage?.split(/[,;]/)[0]?.trim() ?? 'en').toUpperCase();
  },
);
