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

export function notFound(message: string): AppError {
  return new AppError(message, 404, 'NOT_FOUND')
}

export function forbidden(message: string): AppError {
  return new AppError(message, 403, 'FORBIDDEN')
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

    if (
      error instanceof Error &&
      'statusCode' in error &&
      typeof (error as { statusCode: unknown }).statusCode === 'number' &&
      (error as { statusCode: number }).statusCode < 500
    ) {
      const statusCode = (error as { statusCode: number }).statusCode
      return reply.status(statusCode).send({
        statusCode,
        error: 'VALIDATION_ERROR',
        message: error.message,
      })
    }

    app.log.error(error)
    return reply.status(500).send({
      statusCode: 500,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    })
  })
}
