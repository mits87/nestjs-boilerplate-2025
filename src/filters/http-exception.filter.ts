import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

import { BadRequestValidationException } from '../exceptions';

export enum LocationType {
  HEADER = 'header',
  REQUEST_BODY = 'requestBody',
}

export interface ReducedValidationError {
  location: string;
  locationType: LocationType.REQUEST_BODY;
  message: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errors = this.mapValidationErrors(exception);
    const [{ code, message }] = errors;

    const error = {
      code,
      errors,
      message,
      path: request.url,
      response: exception.getResponse(),
      stack: exception.stack,
      status: exception.getStatus(),
    };

    this.logger.warn({ error }, 'Exception during HTTP request occured.');

    response.status(error.status).json({
      code: error.code,
      errors: error.errors,
      message: error.message,
      status: error.status,
    });
  }

  private formatValidationError(error: ValidationError, parentPath?: string): ReducedValidationError {
    const message = Object.values(
      Object.entries(error.constraints || {}).reduce(
        (acc, [key, constraint]) => ({
          ...acc,
          [key]: parentPath ? `${parentPath}.${constraint}` : constraint,
        }),
        [],
      ),
    ).join(', ');

    return {
      location: parentPath ? `${parentPath}.${error.property}` : error.property,
      // @todo: should be determined dynamically and not be fixed
      locationType: LocationType.REQUEST_BODY,
      message,
    };
  }

  private mapChildrenValidationErrors(error: ValidationError, parentPath?: string): ReducedValidationError[] {
    if (!(error.children && error.children.length)) {
      return [this.formatValidationError(error, parentPath)];
    }

    parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;

    return error.children.flatMap((err: ValidationError) => {
      if (err.children && err.children.length) {
        return this.mapChildrenValidationErrors(err, parentPath);
      }
      return this.formatValidationError(err, parentPath);
    });
  }

  private mapValidationErrors(exception: HttpException) {
    if (exception instanceof BadRequestValidationException) {
      return exception.validationErrors
        .flatMap((error) => this.mapChildrenValidationErrors(error))
        .filter((item) => item.message)
        .map((item) => ({
          ...item,
          code: exception.name,
          message: `${exception.message}: ${item.message}`,
        }));
    }

    return [
      {
        code: exception.name,
        message: exception.message,
      },
    ];
  }
}
