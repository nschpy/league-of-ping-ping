import type { AuthMode } from '@/pages/auth/AuthPage';

interface Props { mode: AuthMode; onChangeMode: (m: AuthMode) => void; }

export function AuthFooter({ mode, onChangeMode }: Props) {
  const isSignIn = mode === 'signin';
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-fg-3 tracking-[0.1em] uppercase">
      <span>v1.0</span>
      <span className="ml-auto">{isSignIn ? 'New here?' : 'Have an account?'}</span>
      <button
        type="button"
        onClick={() => onChangeMode(isSignIn ? 'signup' : 'signin')}
        className="text-[oklch(0.74_0.18_55)] hover:underline uppercase tracking-[0.1em]"
      >
        {isSignIn ? 'Sign up' : 'Sign in'}
      </button>
    </div>
  );
}
