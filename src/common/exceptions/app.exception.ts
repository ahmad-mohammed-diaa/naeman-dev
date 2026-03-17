import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorKeys } from '../constants/error-keys';
export class AppException extends HttpException {
  constructor(
    message: keyof typeof ErrorKeys,
    statusCode: HttpStatus,
    error?: unknown,
  ) {
    super({ statusCode, message: ErrorKeys[message], error }, statusCode);
  }
}

export class AppNotFoundException extends AppException {
  constructor(key = 'COMMON_NOT_FOUND' as keyof typeof ErrorKeys) {
    super(key, HttpStatus.NOT_FOUND);
  }
}

export class AppConflictException extends AppException {
  constructor(key = 'COMMON_CONFLICT' as keyof typeof ErrorKeys) {
    super(key, HttpStatus.CONFLICT);
  }
}

export class AppBadRequestException extends AppException {
  constructor(key = 'COMMON_BAD_REQUEST' as keyof typeof ErrorKeys) {
    super(key, HttpStatus.BAD_REQUEST);
  }
}

export class AppForbiddenException extends AppException {
  constructor(key = 'COMMON_FORBIDDEN' as keyof typeof ErrorKeys) {
    super(key, HttpStatus.FORBIDDEN);
  }
}
// ;

export class AppUnauthorizedException extends AppException {
  constructor(key = 'COMMON_UNAUTHORIZED' as keyof typeof ErrorKeys) {
    super(key, HttpStatus.UNAUTHORIZED);
  }
}
export class Catch extends AppException {
  constructor(key = 'COMMON_INTERNAL_ERROR' as keyof typeof ErrorKeys) {
    super(key, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
