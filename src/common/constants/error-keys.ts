export const ErrorKeys = {
  COMMON_INTERNAL_ERROR: 'common.internalError',
  COMMON_NOT_FOUND: 'common.notFound',
  COMMON_FORBIDDEN: 'common.forbidden',
  COMMON_UNAUTHORIZED: 'common.unauthorized',
  COMMON_BAD_REQUEST: 'common.badRequest',
  COMMON_CONFLICT: 'common.conflict',

  // auth
  AUTH_INVALID_CREDENTIALS: 'AUTH.INVALID_CREDENTIALS',
  AUTH_OTP_INVALID: 'AUTH.OTP_INVALID',
  AUTH_OTP_EXPIRED: 'AUTH.OTP_EXPIRED',
  AUTH_RESET_INVALID: 'AUTH.RESET_INVALID',
  AUTH_RESET_EXPIRED: 'AUTH.RESET_EXPIRED',
  // user
  NOT_FOUND_USER: 'user.notFound',
  CONFLICT_USER: 'user.conflict',
  NOT_FOUND_ROLE: 'user.roleNotFound',
  // barber / cashier / branch
  NOT_FOUND_BARBER: 'barber.notFound',
  NOT_FOUND_CASHIER: 'cashier.notFound',
  NOT_FOUND_BRANCH: 'branch.notFound',
  // category / service
  NOT_FOUND_CATEGORY: 'category.notFound',
  NOT_FOUND_SERVICE: 'service.notFound',
  SERVICE_UNAVAILABLE: 'service.unavailable',
  // order
  NOT_FOUND_ORDER: 'order.notFound',
  DUPLICATE_ORDER: 'order.duplicate',
  ORDER_FORBIDDEN: 'order.forbidden',
  ORDER_INVALID_REVIEW_TOKEN: 'order.invalidReviewToken',
  ORDER_BOOKING_DATE_INVALID: 'order.bookingDateInvalid',
  ORDER_NO_ACTIVE_PACKAGE: 'order.noActivePackage',
  ORDER_PACKAGE_NO_SESSIONS: 'order.packageNoSessions',
  ORDER_SERVICE_IDS_REQUIRED: 'order.serviceIdsRequired',
  ORDER_SLOT_CONFLICT: 'order.slotConflict',
  ORDER_DATE_PAST_NOT_ALLOWED: 'order.datePastNotAllowed',
  // client
  NOT_FOUND_CLIENT: 'client.notFound',
  CLIENT_BANNED: 'client.banned',
  // offers / package / promo / product
  NOT_FOUND_OFFER: 'offer.notFound',
  OFFER_EXPIRED: 'offer.expired',
  OFFER_INVALID_TYPE: 'offer.invalidType',
  NOT_FOUND_PACKAGE: 'package.notFound',
  PACKAGE_SERVICE_INVALID: 'package.serviceInvalid',
  PACKAGE_TYPE_REQUIRED: 'package.typeRequired',
  PACKAGE_SERVICES_REQUIRED: 'package.servicesRequired',
  POINTS_AMOUNT_REQUIRED: 'points.amountRequired',
  NOT_FOUND_PROMO: 'promoCode.notFound',
  PROMO_INVALID: 'promoCode.invalid',
  NOT_FOUND_PRODUCT: 'product.notFound',
  NOT_FOUND_SETTINGS: 'settings.notFound',
  NOT_FOUND_STATIC: 'static.notFound',
} as const;

export type ErrorKey = (typeof ErrorKeys)[keyof typeof ErrorKeys];
