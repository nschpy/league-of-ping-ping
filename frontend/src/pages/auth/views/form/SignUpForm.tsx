import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/auth-context';
import { signUpSchema, type SignUpValues } from '@/core/auth/auth-schemas';
import { useAuthFormSubmit } from '@/core/auth/use-auth-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from './FieldError';
import { FormError } from './FormError';
import { StarterMmrBadge } from './StarterMmrBadge';

const Field = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-1.5">{children}</div>
);

export function SignUpForm() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
  });
  const { onSubmit, formError } = useAuthFormSubmit<SignUpValues>(async (v) => {
    await signUp(v);
    navigate('/dashboard');
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormError message={formError} />
      <StarterMmrBadge />
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label htmlFor="displayName" className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-3">Full name</Label>
          <Input id="displayName" placeholder="Naomi Hart" autoComplete="name" {...register('displayName')} />
          <FieldError message={errors.displayName?.message} />
        </Field>
        <Field>
          <Label htmlFor="username" className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-3">Handle</Label>
          <Input id="username" placeholder="naomih" autoComplete="username" {...register('username')} />
          <FieldError message={errors.username?.message} />
        </Field>
      </div>
      <Field>
        <Label htmlFor="email-signup" className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-3">Email</Label>
        <Input id="email-signup" type="email" autoComplete="email" placeholder="you@league.gg" {...register('email')} />
        <FieldError message={errors.email?.message} />
      </Field>
      <Field>
        <Label htmlFor="password-signup" className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg-3">Password</Label>
        <Input id="password-signup" type="password" autoComplete="new-password" placeholder="••••••••" {...register('password')} />
        <FieldError message={errors.password?.message} />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="w-full font-semibold tracking-wide">
        {isSubmitting ? 'Creating account…' : 'Create account →'}
      </Button>
    </form>
  );
}
