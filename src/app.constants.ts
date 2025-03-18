export const IS_DEBUG = process.env.DEBUG === '1';

export const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production';

export const STAGE = process.env.STAGE || 'local';

export const IS_PRODUCTION = STAGE === 'prod';

export const API_V1 = '1';
