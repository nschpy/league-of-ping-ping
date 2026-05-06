/**
 * Читает обязательную переменную окружения.
 * @param key - Имя переменной окружения
 * @throws Error если переменная не задана или пустая
 */
import dotenv from 'dotenv';

dotenv.config();

function getRequired(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Читает переменную окружения как целое число.
 * @param key - Имя переменной окружения
 * @param defaultValue - Значение по умолчанию, если переменная не задана
 * @throws Error если значение не является валидным целым числом
 */
function getInt(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return defaultValue;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) throw new Error(`Environment variable ${key} must be an integer`);
  return parsed;
}

/**
 * Конфигурация приложения из переменных окружения.
 * @readonly Все значения недоступны для изменения после инициализации
 */
export const env = {
  mongodbUri: getRequired('MONGODB_URI'),
  port: getInt('PORT', 3000),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  bcryptRounds: getInt('BCRYPT_ROUNDS', 10),
  jwtSecret: getRequired('JWT_SECRET'),
  jwtTtl: process.env['JWT_TTL'] ?? '7d',
  corsOrigins: process.env['CORS_ORIGINS'] ?? '*',
} as const;
