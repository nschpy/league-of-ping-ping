import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { AuthModeToggle } from './components/AuthModeToggle'
import { SocialButtons } from './components/SocialButtons'
import { AuthFooter } from './components/AuthFooter'
import { loginSchema, type LoginInput } from '@/lib/auth-schemas'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { AuthResponse } from '@/lib/types'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', data)
      setAuth(res.token, res.user)
      void navigate('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка входа')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-[400px] w-full">
      <AuthModeToggle />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, letterSpacing: 0 }} className="uppercase text-foreground mb-2">
        С возвращением
      </h2>
      <p className="text-muted-foreground text-[14px] mb-8">Возьми ракетку и продолжим.</p>

      <div className="flex flex-col gap-[18px]">
        <div>
          <Label htmlFor="login-email" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em' }} className="uppercase text-muted-foreground mb-2 block">E-mail</Label>
          <Input id="login-email" {...register('email')} placeholder="player@league.tennis" autoComplete="email" className="h-12 bg-card border-border" />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="login-password" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em' }} className="uppercase text-muted-foreground mb-2 block">Пароль</Label>
          <Input id="login-password" {...register('password')} type="password" placeholder="••••••••••" autoComplete="current-password" className="h-12 bg-card border-border" />
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer">
            <input type="checkbox" {...register('rememberMe')} className="sr-only peer" />
            <span className="size-4 rounded-[2px] border border-border bg-transparent peer-checked:bg-primary flex items-center justify-center transition-colors">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-0 peer-checked:opacity-100 transition-opacity">
                <path d="M2 5L4 7L8 3" stroke="#0b0b0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Запомнить меня
          </label>
          <button type="button" onClick={() => toast.info('Скоро')} className="text-[13px] text-primary font-medium cursor-pointer bg-transparent border-none">
            Забыли пароль?
          </button>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <Button type="submit" disabled={isSubmitting} className="h-12 w-full uppercase tracking-[0.12em] text-[14px]" style={{ fontFamily: 'var(--font-display)', boxShadow: '0 0 0 1px var(--color-primary), 0 4px 0 -2px rgba(255,91,31,.35)' }}>
          {isSubmitting ? '...' : 'Войти →'}
        </Button>
        <div className="flex items-center gap-3 text-muted-foreground/60 text-[12px] my-1">
          <Separator className="flex-1" />
          <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.16em' }} className="uppercase">или</span>
          <Separator className="flex-1" />
        </div>
        <SocialButtons />
      </div>

      <AuthFooter />
    </form>
  )
}
