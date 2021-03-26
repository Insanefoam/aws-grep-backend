import { config } from 'dotenv';
import { env } from 'process';
config();

export const {
  FRONTEND_URL,
  PORT,
  ELASTIC_SERVER_URL,
  AWS_BUCKET_NAME,
  AWS_REGION_NAME,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
} = env;
