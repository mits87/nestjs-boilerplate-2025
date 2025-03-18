import { type MiddlewareConsumer, type NestModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import configuration from './config/config.factory';
import { HttpExceptionFilter } from './filters';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './modules/auth/guards';
import { LoggerMiddleware } from './modules/logger/logger.middleware';
import { LoggerModule } from './modules/logger/logger.module';
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
    LoggerModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configures the middleware for the application.
   *
   * @param {MiddlewareConsumer} consumer - The consumer to apply middleware to.
   */
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
