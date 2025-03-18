import { createParamDecorator, CustomDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

import { IUser } from './auth.types';

export const IS_PUBLIC_KEY = 'isPublic';

export const CurrentAuth = createParamDecorator((data: unknown, ctx: ExecutionContext): IUser => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as IUser;
});

/**
 * The @ApiPublicAccess() Decorator which allows to have public routes without auth restriction.
 *
 * @returns A decorator object.
 */
export const ApiPublicAccess = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
