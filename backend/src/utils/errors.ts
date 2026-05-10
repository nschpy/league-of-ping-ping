import type { FastifyInstance } from 'fastify'

export class AppError extends Error {
  readonly statusCode: number
  readonly code: string

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
  }
}

export function badRequest(message: string): AppError {
  return new AppError(message, 400, 'BAD_REQUEST')
}

export function unauthorized(message: string): AppError {
  return new AppError(message, 401, 'UNAUTHORIZED')
}

export function conflict(message: string): AppError {
  return new AppError(message, 409, 'CONFLICT')
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.code,
        message: error.message,
      })
    }

    const statusCode = error instanceof Error && 'statusCode' in error && typeof (error as { statusCode: unknown }).statusCode === 'number'
      ? (error as { statusCode: number }).statusCode
      : 500
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return reply.status(statusCode).send({
      statusCode,
      error: 'INTERNAL_SERVER_ERROR',
      message,
    })
  })
}
