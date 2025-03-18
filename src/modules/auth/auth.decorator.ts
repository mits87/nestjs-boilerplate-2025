import { createParamDecorator, CustomDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

import { IUser } from './auth.types';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

export const CurrentAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => ctx.switchToHttp().getRequest().user,
);

/**
 * The @ApiPublicAccess() Decorator which allows to have public routes without auth restriction.
 *
 * @returns A decorator object.
 */
export const ApiPublicAccess = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
