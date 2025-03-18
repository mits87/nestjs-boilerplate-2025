import { IConfig } from './config.interface';

export default (): IConfig => ({
  stage: 'dev',
  jwtSecretKey: 'secret',
});
