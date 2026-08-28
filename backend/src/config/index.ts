import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';


const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const config = {
  PORT: parseInt(process.env.PORT || '5001'),
  NODE_ENV: env,
  BACKEND_URL: process.env.BACKEND_URL,
  DATABASE_URL: process.env.DATABASE_URL as string,
//   redis: {
//     host:
//       process.env.REDIS_HOST ||
//       (() => {
//         throw new Error('REDIS_HOST environment variable is required');
//       })(),
//     port: parseInt(process.env.REDIS_PORT || '6379'),
//     username: process.env.REDIS_USERNAME as string,
//     password:
//       process.env.REDIS_PASSWORD ||
//       (() => {
//         throw new Error('REDIS_PASSWORD environment variable is required');
//       })(),
//     db: parseInt(process.env.REDIS_DB || '0'),
//     retryAttemptsOnFailover: parseInt(process.env.REDIS_RETRY_ATTEMPTS_ON_FAILOVER || '5'),
//     maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES_PER_REQUEST || '3'),
//     lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
//     keepAlive: process.env.REDIS_KEEP_ALIVE ? parseInt(process.env.REDIS_KEEP_ALIVE) : 0, // keepAlive should be a number (ms)
//     connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000'),
//     commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000'),
//   },

//   cookie: {
//     secret: process.env.COOKIE_SECRET || 'default_cookie_secret',
//   },


};

export default config;
