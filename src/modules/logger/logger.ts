import pino, { Logger, SerializedError, stdSerializers, LoggerOptions } from 'pino';

/**
 * Available log levels
 */
export enum LOG_LEVEL {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export type ILogger = Logger;

const errSerializer = (err: SerializedError) => {
  const errRequest = err?.request ? { request: stdSerializers.req(err.request) } : {};
  const errResponse = err?.response ? { response: stdSerializers.res(err.response) } : {};
  return { ...err, ...errRequest, ...errResponse };
};

const defaultOptions: LoggerOptions = {
  // allow log supression
  enabled: process.env.LOG_LEVEL?.toLowerCase() !== 'silent',

  // reformat the level to a label instead of integer
  formatters: {
    level: (label: string, level: number) => ({ level, level_label: label }),
  },

  // set the level by env variable or use the defaults
  level: process.env.LOG_LEVEL?.toLowerCase() || LOG_LEVEL.INFO,

  // set the lambda name to make debugging easier
  name: (process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.SERVICE_NAME)?.toLowerCase() || 'default',

  // enable pretty print for local development
  transport:
    process.env.LOG_PRETTY === 'true'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,

  serializers: {
    err: stdSerializers.wrapErrorSerializer(errSerializer),
    error: stdSerializers.wrapErrorSerializer(errSerializer),
  },
};

export const create = (options: LoggerOptions): ILogger => {
  return pino({ ...defaultOptions, ...options }) as ILogger;
};

/**
 * A default instance of a logger
 */
export const logger = create({});
