import { BadRequestException, ValidationError } from '@nestjs/common';

export class BadRequestValidationException extends BadRequestException {
  public readonly validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[], objectOrError?: string | object | any, description?: string) {
    super(objectOrError, description);
    this.validationErrors = validationErrors;
  }
}
