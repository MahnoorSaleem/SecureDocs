import Redis from 'ioredis';

import config from './config';

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
//   tls: {rejectUnauthorized: false,}, // Needed for Redis Cloud (SSL) - worked after commenting this
});

export default redis;