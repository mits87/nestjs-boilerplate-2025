import { LoggerService as BaseLoggerService, ConsoleLogger } from '@nestjs/common';

import { logger } from './logger';

export class LoggerService extends ConsoleLogger implements BaseLoggerService {
  private static DEBUG_CONTEXTS = [
    'InstanceLoader',
    'NestFactory',
    'NestApplication',
    'RoutesResolver',
    'RouterExplorer',
  ];

  constructor() {
    super();
    Object.assign(this, {
      debug: (message: string, context?: Record<string, any> | string) => this.logMessage('debug', message, context),
      error: (message: string, context?: Record<string, any> | string) => this.logMessage('error', message, context),
      log: (message: string, context?: Record<string, any> | string) => this.logMessage('info', message, context),
      verbose: (message: string, context?: Record<string, any> | string) => this.logMessage('trace', message, context),
      warn: (message: string, context?: Record<string, any> | string) => this.logMessage('warn', message, context),
    });
  }

  private logMessage(level: 'trace' | 'debug' | 'info' | 'warn' | 'error', message: string, context?: any): void {
    const selectedLevel = LoggerService.DEBUG_CONTEXTS.includes(context) ? 'debug' : level;

    logger[selectedLevel]({ context }, message);
  }
}
