import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({ description: 'Application status.', example: 'ok' })
  status: string;
}
