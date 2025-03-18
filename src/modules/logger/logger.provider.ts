import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ILogger, logger } from './logger';

export const LOGGER = 'LOGGER';

export const LoggerProvider: FactoryProvider<ILogger> = {
  inject: [ConfigService],
  provide: LOGGER,
  useFactory: (config: ConfigService): ILogger => {
    return logger.child({ stage: config.get('stage') });
  },
};

export { ILogger };
