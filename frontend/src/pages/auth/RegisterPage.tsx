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
import { registerSchema, type RegisterInput } from '@/lib/auth-schemas'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface AuthResponse { token: string; user: { id: string; email: string; nickname: string; mmr: number; role: string } }

const fieldClass = 'h-12 bg-card border-border'
const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em' } as const
const headStyle = { fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 1, letterSpacing: 0 } as const

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await api.post<AuthResponse>('/auth/register', data)
      setAuth(res.token, res.user)
      void navigate('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка регистрации')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-[400px] w-full">
      <AuthModeToggle />
      <h2 style={headStyle} className="uppercase text-foreground mb-2">Создать аккаунт</h2>
      <p className="text-muted-foreground text-[14px] mb-8">Стартовый MMR — 1000. Поехали.</p>

      <div className="flex flex-col gap-[18px]">
        <div>
          <Label style={labelStyle} className="uppercase text-muted-foreground mb-2 block">Никнейм</Label>
          <Input {...register('nickname')} placeholder="thunder.spin" className={fieldClass} />
          {errors.nickname
            ? <p className="text-destructive text-xs mt-1">{errors.nickname.message}</p>
            : <p className="text-muted-foreground/60 text-[12px] mt-1.5">будет видно соперникам</p>
          }
        </div>
        <div>
          <Label style={labelStyle} className="uppercase text-muted-foreground mb-2 block">E-mail</Label>
          <Input {...register('email')} placeholder="player@league.tennis" className={fieldClass} />
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label style={labelStyle} className="uppercase text-muted-foreground mb-2 block">Пароль</Label>
          <Input {...register('password')} type="password" placeholder="••••••••••" className={fieldClass} />
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3">
        <Button type="submit" disabled={isSubmitting} className="h-12 w-full uppercase tracking-[0.12em] text-[14px]" style={{ fontFamily: 'var(--font-display)', boxShadow: '0 0 0 1px var(--color-primary), 0 4px 0 -2px rgba(255,91,31,.35)' }}>
          {isSubmitting ? '...' : 'Создать аккаунт →'}
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
