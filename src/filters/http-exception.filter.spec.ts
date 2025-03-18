import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpExceptionFilter } from './http-exception.filter';
import { logger } from '../modules/logger/logger';

describe('HttpExceptionFilter', () => {
  let httpExceptionFilter: HttpExceptionFilter;

  const mockJson = jest.fn();

  const mockStatus = jest.fn(() => ({
    json: mockJson,
  }));

  const mockGetResponse = jest.fn(() => ({
    status: mockStatus,
  }));

  const mockCtx = {
    getRequest: jest.fn(() => ({
      url: '/test',
    })),
    getResponse: mockGetResponse,
  };

  const mockHost: any = {
    switchToHttp: jest.fn(() => mockCtx),
  };

  const mockException = new HttpException('HttpException', HttpStatus.BAD_REQUEST);

  const expectedError = {
    code: mockException.name,
    errors: expect.arrayContaining([
      expect.objectContaining({
        code: mockException.message,
        message: mockException.message,
      }),
    ]),
    message: mockException.message,
    status: mockException.getStatus(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    httpExceptionFilter = moduleRef.get(HttpExceptionFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should catch exception', () => {
    httpExceptionFilter.catch(mockException, mockHost);

    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);

    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith(expectedError);

    expect(logger.warn).toHaveBeenCalled();
  });
});
