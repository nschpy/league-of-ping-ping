import { Button } from '@/components/ui/button';
import { useAuth } from '@/core/auth/auth-context';

export function DashboardPlaceholder() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <main className="min-h-screen p-12 max-w-3xl mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-5xl tracking-wide">
          Welcome, {user.displayName}.
        </h1>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </header>

      <p className="text-fg-2 font-mono text-xs tracking-widest uppercase">
        JWT round-trip verified via{' '}
        <code className="text-foreground normal-case">/auth/me</code>
      </p>

      <pre className="rounded-xl border border-line bg-bg-1 p-4 text-xs overflow-auto text-fg-1 leading-relaxed">
        {JSON.stringify(user, null, 2)}
      </pre>
    </main>
  );
}
