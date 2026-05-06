import type { ReactNode } from 'react';

interface Props { art: ReactNode; form: ReactNode; }

export function AuthLayout({ art, form }: Props) {
  return (
    <div className="grid min-h-screen md:grid-cols-2 bg-background">
      {art}
      {form}
    </div>
  );
}
