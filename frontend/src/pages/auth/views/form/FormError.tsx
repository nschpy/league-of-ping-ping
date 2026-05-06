interface Props { message?: string | null; }

export function FormError({ message }: Props) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm">
      {message}
    </div>
  );
}
