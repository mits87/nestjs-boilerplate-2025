import { IS_DEBUG } from '../app.constants';

/**
 * Demand an environment variable be present.
 * If the environment variable `DEBUG` is set then only warn.
 *
 * @param {String} key
 * The key of the environment variable.
 *
 * @param {String} defaultValue
 * An optional default in the event the environment variable does not exist.
 *
 * @throws {Error}
 * Thrown if the environment variable does not exist.
 *
 * @returns {String}
 * The required environment variable is returned.
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value: string | undefined = process.env[key] || defaultValue;

  if (value === undefined) {
    if (!IS_DEBUG) {
      throw new Error(`Environment variable ${key} is required.`);
    }
    console.warn(`DEBUG MODE. Ignoring missing env var "${key}"`);
  }

  return value as string;
}
