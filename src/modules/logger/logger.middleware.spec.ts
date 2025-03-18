import { Test, TestingModule } from '@nestjs/testing';
import { NextFunction, Request, Response } from 'express';

import { LoggerMiddleware } from './logger.middleware';
import { LOGGER } from './logger.provider';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;

  const mockLogger = {
    debug: jest.fn(),
    error: jest.fn(),
    flush: jest.fn(),
    warn: jest.fn(),
  };

  const req: Request = {
    body: 'some-body',
    get: (header: string) => req.headers[header],
    headers: { 'user-agent': 'Safari' },
    hostname: 'partners.mocked-address.com',
    method: 'POST',
    path: '/foo',
    query: { name: 'john' },
    route: { path: '/foo' },
  } as any;

  const res: Response = {
    end: jest.fn(),
    get: () => ({
      'content-type': 'application/json',
    }),
    on: jest.fn(),
    statusCode: 200,
    write: jest.fn(),
  } as any;

  const next = jest.fn();

  const getMockedLogger = (httpStatusCategory: string) => {
    switch (httpStatusCategory) {
      case '5XX':
        return mockLogger.error;

      case '4XX':
        return mockLogger.warn;

      default:
        return mockLogger.debug;
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER,
          useValue: mockLogger,
        },
        LoggerMiddleware,
      ],
    }).compile();

    middleware = module.get(LoggerMiddleware);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('use', () => {
    it('should logs request and response with debug level', () => {
      middleware.use(req, res, next);

      expect(mockLogger.debug).toHaveBeenCalledTimes(1);
      expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });
  });

  describe('onFinish', () => {
    it.each([[200], [400], [500]])('should logs %s response', (statusCode: number) => {
      (res.on as jest.Mock).mockImplementation((_, done: NextFunction) => {
        done();
      });

      const httpStatusCategory = `${statusCode.toString()[0]}XX`;
      const logger = getMockedLogger(httpStatusCategory);

      middleware.use(req, { ...res, statusCode } as Response, next);

      expect(logger).toHaveBeenLastCalledWith(
        {
          contentLength: { 'content-type': 'application/json' },
          hostname: req.hostname,
          httpStatusCategory,
          ip: undefined,
          method: 'POST',
          originalUrl: undefined,
          path: req.route.path,
          route: req.path,
          statusCode,
          userAgent: 'Safari',
        },
        'HTTP Response',
      );

      expect(logger).toHaveBeenCalledTimes(httpStatusCategory === '2XX' ? 2 : 1);
      expect(mockLogger.flush).toHaveBeenCalledTimes(1);
    });
  });
});
