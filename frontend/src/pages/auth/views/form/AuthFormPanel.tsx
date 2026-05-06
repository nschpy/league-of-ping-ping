import { useLayoutEffect, useRef } from 'react';
import type { AuthMode } from '@/pages/auth/AuthPage';
import { AuthDivider } from './AuthDivider';
import { AuthFooter } from './AuthFooter';
import { AuthHeader } from './AuthHeader';
import { AuthTabs } from './AuthTabs';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { SocialAuthRow } from './SocialAuthRow';

interface Props { mode: AuthMode; onChangeMode: (m: AuthMode) => void; }

function FormSlot({ mode }: { mode: AuthMode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    wrapper.style.height = `${inner.scrollHeight}px`;
  }, [mode]);

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden"
      style={{ transition: 'height 300ms cubic-bezier(0.22,1,0.36,1)' }}
    >
      <div ref={innerRef} key={mode} className="auth-enter">
        {mode === 'signin' ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
}

export function AuthFormPanel({ mode, onChangeMode }: Props) {
  return (
    <section className="grid place-items-center p-8 min-h-screen">
      <div className="w-full max-w-[420px] flex flex-col gap-[18px]">
        <AuthTabs value={mode} onChange={onChangeMode} />
        <AuthHeader key={mode} mode={mode} />
        <FormSlot mode={mode} />
        <AuthDivider />
        <SocialAuthRow />
        <AuthFooter mode={mode} onChangeMode={onChangeMode} />
      </div>
    </section>
  );
}
