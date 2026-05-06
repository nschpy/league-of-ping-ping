import type { AuthMode } from '@/pages/auth/AuthPage';

interface Props { mode: AuthMode; }

const COPY = {
  signin: { title: 'WELCOME BACK.',  sub: 'Sign in to track your matches, MMR and rivalries.' },
  signup: { title: 'JOIN THE LADDER.', sub: 'Create an account — every new player starts at 1000 MMR.' },
} as const;

export function AuthHeader({ mode }: Props) {
  const { title, sub } = COPY[mode];
  return (
    <div className="auth-enter flex flex-col gap-1">
      <h2 className="font-display text-[44px] leading-none tracking-[0.02em] font-normal">{title}</h2>
      <p className="text-fg-2 text-sm">{sub}</p>
    </div>
  );
}
