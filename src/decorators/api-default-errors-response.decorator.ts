import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

/**
 * ApiDefaultErrorsResponse
 *
 * @returns Class decorator & method decorator
 */
export function ApiDefaultErrorsResponse(): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiBadRequestResponse({ description: 'Bad Request' }),
    ApiUnprocessableEntityResponse({ description: 'Unprocessable Entity' }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
  );
}
