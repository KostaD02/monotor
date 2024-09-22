export enum ExceptionStatusKeys {
  NotFound = 'errors.not_found',
  Forbidden = 'errors.forbidden',
  BadRequest = 'errors.bad_request',
  PaymentRequired = 'errors.payment_required',
  Unauthorized = 'errors.unauthorized',
  Conflict = 'errors.conflict',
  Teapot = 'errors.teapot',
  ContentTooLarge = 'errors.content_too_large',
  UnsupportedMediaType = 'errors.unsupported_media_type',
  EnhanceYourCalm = 'errors.enhance_your_calm',
}

export enum GlobalExceptionKeys {
  IncorrectMongooseID = 'errors.incorrect_mongoose_id',
  PageIndexNotNumber = 'errors.page_index.not_number',
  PageIndexTooLow = 'errors.page_index.too_low',
  PageSizeNotNumber = 'errors.page_size.not_number',
  PageSizeTooLow = 'errors.page_size.too_low',
  PageSizeTooHigh = 'errors.page_size.too_high',
  EndPointNotFound = 'errors.endpoint_not_found',
  InvalidJSON = 'errors.invalid_json',
}
