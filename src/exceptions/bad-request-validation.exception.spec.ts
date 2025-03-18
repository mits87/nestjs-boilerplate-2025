import { ValidationError } from '@nestjs/common';

import { BadRequestValidationException } from './bad-request-validation.exception';

describe('BadRequestValidationException', () => {
  it('should use BadRequestValidationException', () => {
    const validationErrors = [{ value: 'data' }] as unknown as ValidationError[];

    const exception = new BadRequestValidationException(validationErrors, 'Validation failed');

    expect(exception.validationErrors).toEqual(validationErrors);
  });
});
