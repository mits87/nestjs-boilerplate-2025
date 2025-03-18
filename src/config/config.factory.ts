import { IS_PRODUCTION, STAGE } from '../app.constants';
import { getEnv } from '../utils';
import { IConfig } from './config.interface';

export default (): IConfig => ({
  stage: STAGE,
  jwt: {
    secret: getEnv('JWT_SECRET_KEY'),
    expiresIn: IS_PRODUCTION ? '48h' : '30d',
  },
});
