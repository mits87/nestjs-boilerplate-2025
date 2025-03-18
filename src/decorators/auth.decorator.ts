import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { IUser } from '../modules/auth/auth.types';

export const Auth = createParamDecorator((data: unknown, ctx: ExecutionContext): IUser => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user as IUser;
});
