import { useState } from 'react';
import { AuthLayout } from './views/AuthLayout';
import { AuthArtPanel } from './views/art/AuthArtPanel';
import { AuthFormPanel } from './views/form/AuthFormPanel';

export type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');

  return (
    <AuthLayout
      art={<AuthArtPanel />}
      form={<AuthFormPanel mode={mode} onChangeMode={setMode} />}
    />
  );
}
