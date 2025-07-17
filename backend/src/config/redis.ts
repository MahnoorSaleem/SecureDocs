import Redis from 'ioredis';

import config from './config';

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  keepAlive: 1000,
//   tls: {rejectUnauthorized: false,}, // Needed for Redis Cloud (SSL) - worked after commenting this
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
  // Optionally: implement retry logic, alerts, etc.
});

redis.on('close', () => {
  console.warn('⚠️ Redis connection closed');
});

export default redis;