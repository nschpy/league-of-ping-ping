function getRequired(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getInt(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return defaultValue;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) throw new Error(`Environment variable ${key} must be an integer`);
  return parsed;
}

export const env = {
  mongodbUri: getRequired('MONGODB_URI'),
  port: getInt('PORT', 3000),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  bcryptRounds: getInt('BCRYPT_ROUNDS', 10),
} as const;
