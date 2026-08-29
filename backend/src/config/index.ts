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
};

export default config;
