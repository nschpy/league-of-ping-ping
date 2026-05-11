import { z } from 'zod'

export const emailSchema = z.string().email('Некорректный email')
export const passwordSchema = z.string().min(8, 'Минимум 8 символов')
export const nicknameSchema = z
  .string()
  .min(3, 'Минимум 3 символа')
  .max(20, 'Максимум 20 символов')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Только буквы, цифры, . _ -')

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  // sent to backend — controls JWT TTL: true → 30d, false/undefined → 1d
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  email: emailSchema,
  nickname: nicknameSchema,
  password: passwordSchema,
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
