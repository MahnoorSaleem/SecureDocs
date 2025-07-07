import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

interface Config {
  port: number;
  nodeEnv: string;
  MONGO_DB_URI: string;
  salt: number;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  S3_BUCKET: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  MAX_REQUESTS: number;
  RATE_LIMIT_WINDOW: number;
  JWT_REFRESH_TOKEN_EXPIRY: number;
}

const config: Config = {
  port: parseInt(requireEnv('PORT'), 10),
  nodeEnv: requireEnv('NODE_ENV'),
  MONGO_DB_URI: requireEnv('MONGO_DB_URI'),
  salt: parseInt(requireEnv('SALT'), 10),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
  AWS_REGION: requireEnv('AWS_REGION'),
  AWS_ACCESS_KEY_ID: requireEnv('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: requireEnv('AWS_SECRET_ACCESS_KEY'),
  S3_BUCKET: requireEnv('S3_BUCKET'),
  REDIS_HOST: requireEnv('REDIS_HOST'),
  REDIS_PORT: parseInt(requireEnv('REDIS_PORT'), 10),
  REDIS_PASSWORD: requireEnv('REDIS_PASSWORD'),
  MAX_REQUESTS: parseInt(requireEnv('MAX_REQUESTS'), 10),
  RATE_LIMIT_WINDOW: parseInt(requireEnv('RATE_LIMIT_WINDOW'), 10),
  JWT_REFRESH_TOKEN_EXPIRY: parseInt(
    requireEnv('JWT_REFRESH_TOKEN_EXPIRY'),
    10,
  ),
};

export const corsOrigin =
  config.nodeEnv === 'production'
    ? requireEnv('CORS_ORIGIN_PROD')
    : requireEnv('CORS_ORIGIN_DEV');

export default config;
