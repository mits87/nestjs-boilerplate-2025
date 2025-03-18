import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';

import { ILogger, LOGGER } from './logger.provider';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject(LOGGER) private readonly logger: ILogger) {}

  public use(req: any, res: any, next: any) {
    const { body, headers, hostname, ip, method, originalUrl, path, query } = req;

    this.logger.debug(
      {
        body,
        headers,
        method,
        path,
        query,
      },
      'Incoming HTTP Request',
    );

    res.on('finish', () => {
      const { statusCode } = res;

      const userAgent = req.get('user-agent');
      const contentLength = res.get('content-length');

      const httpStatusCategory = `${statusCode.toString().charAt(Number('0'))}XX`;

      // Path with parameters, eg `/orders/:orderId`
      const route = req.route?.path;

      const payload = {
        contentLength,
        hostname,
        httpStatusCategory,
        ip,
        method,
        originalUrl,
        path,
        route,
        statusCode,
        userAgent,
      };

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(payload, 'HTTP Response');
      } else if (statusCode >= HttpStatus.BAD_REQUEST) {
        this.logger.warn(payload, 'HTTP Response');
      } else {
        this.logger.debug(payload, 'HTTP Response');
      }

      this.logger.flush();
    });

    next();
  }
}
