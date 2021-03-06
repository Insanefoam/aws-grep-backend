import { config } from 'dotenv';
import { env } from 'process';
config();

export const { FRONTEND_URL, PORT, ELASTIC_SERVER_URL } = env;
