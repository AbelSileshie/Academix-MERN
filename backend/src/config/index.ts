import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variables schema
const envSchema = z.object({
  // Server
  PORT: z.string().default('8000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  MONGODB_URI: z.string(),

  // Auth
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // Gemini AI
  GEMINI_API_KEY: z.string().optional(),
});

// Parse and validate environment variables
const env = envSchema.parse(process.env);

export default {
  server: {
    port: parseInt(env.PORT),
    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === 'development',
  },
  db: {
    mongoUri: env.MONGODB_URI,
  },
  auth: {
    secret: env.BETTER_AUTH_SECRET,
    url: env.BETTER_AUTH_URL,
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
  },
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT) : undefined,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
  },
  gemini: {
    apiKey: env.GEMINI_API_KEY,
  },
} as const;
