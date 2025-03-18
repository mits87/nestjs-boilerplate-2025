export interface IConfig {
  stage: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
}
