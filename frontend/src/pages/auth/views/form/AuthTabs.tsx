import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AuthMode } from '@/pages/auth/AuthPage';

interface Props {
  value: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export function AuthTabs({ value, onChange }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as AuthMode)} className="w-full">
      <TabsList className="w-full bg-bg-1 border border-line rounded-xl p-1 h-auto">
        <TabsTrigger value="signin" className="flex-1 font-mono text-[13px] tracking-[0.1em] uppercase py-2">
          Sign In
        </TabsTrigger>
        <TabsTrigger value="signup" className="flex-1 font-mono text-[13px] tracking-[0.1em] uppercase py-2">
          Sign Up
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
