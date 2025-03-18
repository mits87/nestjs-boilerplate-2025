import { Global, Module } from '@nestjs/common';

import { LoggerProvider } from './logger.provider';

@Global()
@Module({
  exports: [LoggerProvider],
  providers: [LoggerProvider],
})
export class LoggerModule {}
