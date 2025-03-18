import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { SignOptions } from 'jsonwebtoken';

import { JwtGuard } from './guards';
import { JwtStrategy } from './strategies';

@Module({
  controllers: [],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('jwt.secret');

        if (!secret) {
          throw new Error('JWT secret is not defined');
        }

        const expiresIn = configService.get<SignOptions['expiresIn']>('jwt.expiresIn');

        return {
          secret,
          ...(expiresIn ? { signOptions: { expiresIn } } : {}),
        };
      },
    }),
  ],
  providers: [JwtGuard, JwtStrategy],
})
export class AuthModule {}
