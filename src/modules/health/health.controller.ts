import { Controller, Get } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthCheckResponseDto } from './dtos';
import { API_V1 } from '../../app.constants';
import { ApiPublicAccess } from '../auth/auth.decorator';

@ApiTags('Health')
@ApiPublicAccess()
@Controller({ path: 'health', version: API_V1 })
export class HealthController {
  /**
   * Check API Accessibility.
   *
   * @returns An object indicating the status of the API accessibility.
   */
  @Get('/ping')
  @ApiOperation({
    summary: 'API Accessibility Check',
    description: 'Checks whether the API is accessible and functioning correctly.',
  })
  @ApiOkResponse({ description: 'The API is accessible and functioning correctly.', type: HealthCheckResponseDto })
  @ApiInternalServerErrorResponse({ description: 'The API is inaccessible due to an internal server error.' })
  public ping(): HealthCheckResponseDto {
    return { status: 'ok' };
  }
}
