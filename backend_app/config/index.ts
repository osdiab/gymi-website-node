import { ConfigError } from 'backend/config/errors';

function requireEnv(key: string) {
  const val = process.env[key];
  if (val === undefined) {
    throw new ConfigError(`Missing env var '${key}'`);
  }

  return val;
}

function getNodeEnv() {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === undefined) {
    throw new ConfigError('Environment variable \'NODE_ENV\' must be provided.');
  }
  const VALID_NODE_ENVS = ['production', 'development', 'test'];
  if (!VALID_NODE_ENVS.includes(nodeEnv)) {
    throw new ConfigError(
      `NODE_ENV must be in ${VALID_NODE_ENVS}, instead found ${nodeEnv}`);
  }
}

function getEmailConfig() {
  return {
    host: requireEnv('GYMI_EMAIL_HOST'),
    username: requireEnv('GYMI_EMAIL_USERNAME'),
    password: requireEnv('GYMI_EMAIL_PASSWORD')
  };
}

function getDbConfig() {
  switch (process.env.NODE_ENV) {
    case 'production': {
      return {
        host: requireEnv('GYMI_WEBSITE_PROD_DB_HOST'),
        database: requireEnv('GYMI_WEBSITE_PROD_DB_DATABASE'),
        user: requireEnv('GYMI_WEBSITE_PROD_DB_USERNAME'),
        password: requireEnv('GYMI_WEBSITE_PROD_DB_PASSWORD'),
        port: parseInt(requireEnv('GYMI_WEBSITE_PROD_DB_PORT'), 10)
      };
    }
    default:
      return {
        host: requireEnv('GYMI_WEBSITE_DEV_DB_HOST'),
        database: requireEnv('GYMI_WEBSITE_DEV_DB_DATABASE'),
        user: requireEnv('GYMI_WEBSITE_DEV_DB_USERNAME'),
        password: requireEnv('GYMI_WEBSITE_DEV_DB_PASSWORD'),
        port: parseInt(requireEnv('GYMI_WEBSITE_DEV_DB_PORT'), 10)
      };
  }
}

/**
 * Configuration only present during a production run of the application.
 */
class ProdConfig {
  public readonly PRIVKEY_CERT_LOC: string = requireEnv('PRIVKEY_CERT_LOC');
  public readonly FULLCHAIN_CERT_LOC: string = requireEnv('FULLCHAIN_CERT_LOC');
}

/**
 * Global configuration for the application.
 */
class Config {
  /**
   * Flag determining the context in which the application is running.
   */
  public readonly nodeEnv = process.env.NODE_ENV || 'development';

  /**
   * Configuration only present on a production run of the application.
   */
  public readonly production =
    process.env.NODE_ENV === 'production' ?  new ProdConfig() : undefined;

  /**
   * Database configuration
   */
  public readonly database = getDbConfig();

  /**
   * Email server configuration
   */
  public readonly email = getEmailConfig();
}

export default new Config();
