import 'dotenv/config'

if (!process.env['JWT_SECRET']) {
  throw new Error('JWT_SECRET environment variable is required')
}

export const config = {
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  MONGO_URI: process.env['MONGO_URI'] ?? 'mongodb://localhost:27017/league-of-ping-pong',
  JWT_SECRET: process.env['JWT_SECRET'],
  PORT: process.env['PORT'] !== undefined ? Number(process.env['PORT']) : 3000,
  CORS_ORIGIN: (process.env['CORS_ORIGIN'] ?? 'http://localhost:5173').split(',').map(s => s.trim()),
} as const
