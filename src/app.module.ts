import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { IS_PRODUCTION, IS_PRODUCTION_BUILD } from './app.constants';
import configuration from './config/config.factory';
import { HttpExceptionFilter } from './filters';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './modules/auth/guards';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

/**
 * AppModule class that implements the NestModule interface.
 * This class configures middleware for the application.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: IS_PRODUCTION ? 'info' : 'debug',
        transport: !IS_PRODUCTION_BUILD ? { target: 'pino-pretty' } : undefined,
      },
    }),
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
