import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtGuard } from './guards';
import { JwtStrategy } from './strategies';
import { IS_PRODUCTION } from '../../app.constants';

@Module({
  controllers: [],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwtSecretKey'),
        signOptions: {
          expiresIn: IS_PRODUCTION ? '48h' : '30d',
        },
      }),
    }),
  ],
  providers: [JwtGuard, JwtStrategy],
})
export class AuthModule {}
