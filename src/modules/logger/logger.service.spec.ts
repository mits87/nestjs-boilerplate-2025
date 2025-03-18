import { Test, TestingModule } from '@nestjs/testing';

import { logger } from './logger';
import { LoggerService } from './logger.service';

jest.mock('./logger');

describe('LoggerService', () => {
  let loggerService: LoggerService;

  const context = 'context';
  const message = 'message';

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    loggerService = moduleRef.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should debug be compatible with pino', () => {
    loggerService.debug(message, context);
    expect(logger.debug).toHaveBeenCalledWith({ context }, message);
  });

  it('should error be compatible with pino', () => {
    loggerService.error(message, context);
    expect(logger.error).toHaveBeenCalledWith({ context }, message);
  });

  it('should log be compatible with pino', () => {
    loggerService.log(message, context);
    expect(logger.info).toHaveBeenCalledWith({ context }, message);
  });

  it('should verbose be compatible with pino', () => {
    loggerService.verbose(message, context);
    expect(logger.trace).toHaveBeenCalledWith({ context }, message);
  });

  it('should warn be compatible with pino', () => {
    loggerService.warn(message, context);
    expect(logger.warn).toHaveBeenCalledWith({ context }, message);
  });
});
