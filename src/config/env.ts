import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  mongodbUri: string;
  corsOrigin: string | string[];
  logLevel: string;
  schedulerApiKey?: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

const requiredEnvVars = ['MONGODB_URI'] as const;

function validateEnv(): void {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}

function parseCorsOrigin(origin: string | undefined): string | string[] {
  if (!origin || origin === '*') {
    return '*';
  }

  return origin.split(',').map((item) => item.trim());
}

function loadEnvConfig(): EnvConfig {
  validateEnv();

  const nodeEnv = process.env.NODE_ENV ?? 'development';

  return {
    nodeEnv,
    port: Number(process.env.PORT) || 5000,
    apiVersion: process.env.API_VERSION ?? 'v1',
    mongodbUri: process.env.MONGODB_URI as string,
    corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN),
    logLevel: process.env.LOG_LEVEL ?? 'dev',
    schedulerApiKey: process.env.SCHEDULER_API_KEY,
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
  };
}

export const env = Object.freeze(loadEnvConfig());
