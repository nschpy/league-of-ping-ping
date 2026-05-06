import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth-context';
import { signInSchema, type SignInValues } from '@/core/auth/auth-schemas';
import { useAuthFormSubmit } from '@/core/auth/use-auth-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from './FieldError';
import { FormError } from './FormError';

const Field = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-1.5">{children}</div>
);

export function SignInForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });
  const { onSubmit, formError } = useAuthFormSubmit<SignInValues>(async (v) => {
    await signIn(v);
    navigate('/dashboard');
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormError message={formError} />
      <Field>
        <Label htmlFor="email" className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-3">Email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@league.gg" {...register('email')} />
        <FieldError message={errors.email?.message} />
      </Field>
      <Field>
        <Label htmlFor="password" className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-3">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} />
        <FieldError message={errors.password?.message} />
      </Field>
      <div className="flex items-center justify-between text-xs text-fg-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox defaultChecked />
          Remember me
        </label>
        <a href="#" className="text-[oklch(0.74_0.18_55)]">Forgot password?</a>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full font-semibold tracking-wide">
        {isSubmitting ? 'Signing in…' : 'Sign In →'}
      </Button>
    </form>
  );
}
