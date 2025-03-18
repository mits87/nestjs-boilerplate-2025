import {
  INestApplication,
  INestApplicationContext,
  NestApplicationOptions,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AbstractHttpAdapter, ContextId, ContextIdFactory, NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { useContainer, ValidationError } from 'class-validator';
import { json, Request, Response } from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import favicon from 'serve-favicon';

import { IS_PRODUCTION_BUILD } from './app.constants';
import { base64Favicon } from './app.favicon';
import { AppModule } from './app.module';
import { useSwagger } from './app.swagger';
import { BadRequestValidationException } from './exceptions';

/**
 * Middleware wrapper.
 *
 * @param {INestApplication} app A NestJS application.
 * @returns {INestApplication} app The same app what was passed to the function.
 */
export function useMiddleware(app: INestApplication): INestApplication {
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(favicon(base64Favicon));
  app.use(
    helmet(
      !IS_PRODUCTION_BUILD
        ? {
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
            crossOriginOpenerPolicy: false,
            crossOriginResourcePolicy: false,
          }
        : undefined,
    ),
  );
  app.use(json({ limit: '1mb' }));

  app.use('/robots.txt', (req: Request, res: Response) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });

  // Sets a global prefix of api https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });

  // Enable validation using Nestjs pipes and class directives
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: !IS_PRODUCTION_BUILD,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestValidationException(validationErrors, 'Validation failed');
      },
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  return app;
}

/**
 * A small wrapper from NestJS Options.
 *
 * @param options - NestJS application options.
 * @returns Default NestJS application options.
 */
export function nestApplicationOptions(options?: NestApplicationOptions): NestApplicationOptions {
  return {
    bufferLogs: true,
    forceCloseConnections: true,
    ...options,
  };
}

/**
 * Creates a platform agnostic Nest Application by loading the application module and pipeline configurations.
 *
 * NOTE: use this wrapper rather than NestFactory methods directly.
 *
 * @param httpAdapter - Type of NodeJS HTTP adapter (in our case mostly expressjs).
 * @param settings    - NestJS application settings.
 * @returns Full NestJS application.
 */
export async function createNestHttpApp(
  httpAdapter?: AbstractHttpAdapter,
  settings?: NestApplicationOptions,
): Promise<INestApplication> {
  const options = nestApplicationOptions(settings);

  // prevents automatic etags from being added
  if (httpAdapter && httpAdapter instanceof ExpressAdapter) {
    httpAdapter.set('etag', false);
    httpAdapter.disable('x-powered-by');
  }

  let app = httpAdapter
    ? await NestFactory.create(AppModule, httpAdapter, options)
    : await NestFactory.create(AppModule, options);

  // This will cause class-validator to use the nestJS module resolution,
  // the fallback option is to spare our selfs from importing all the class-validator modules to nestJS
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app = useMiddleware(app);
  app.useLogger(app.get(Logger));
  app.flushLogs();

  // Starts listening for shutdown hooks.
  app.enableShutdownHooks();

  // Add swagger documentation for the application.
  useSwagger(app);

  return app;
}

/**
 * Creates a minimal Nest application without any network listeners.
 * Primary usage would be non-api workflows like CRON jobs, event subscriptions, etc.
 *
 * NOTE: use this wrapper rather than NestFactory methods directly.
 *
 * @param options - Extra options.
 * @returns Standalone NestJS application.
 */
export async function createStandaloneNestApp(
  options?: NestApplicationOptions,
): Promise<{ app: INestApplicationContext; contextId: ContextId }> {
  const contextId = ContextIdFactory.create();

  const app = await NestFactory.createApplicationContext(AppModule, nestApplicationOptions(options));

  return { app, contextId };
}
