import { useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api';

function toFormError(err: unknown): string | null {
  if (!(err instanceof ApiError)) return null;
  if (err.status === 401) return 'Invalid email or password.';
  if (err.status === 409) return err.message || 'Email or username already in use.';
  if (err.status === 400) return err.message || 'Invalid input.';
  return null;
}

export function useAuthFormSubmit<V>(action: (values: V) => Promise<void>) {
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(values: V) {
    setFormError(null);
    try {
      await action(values);
    } catch (err) {
      const inline = toFormError(err);
      if (inline) {
        setFormError(inline);
      } else {
        toast.error('Network error. Please try again.');
      }
    }
  }

  return { onSubmit, formError };
}
