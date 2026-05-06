interface Props { message?: string; }

export function FieldError({ message }: Props) {
  if (!message) return null;
  return <p className="text-destructive text-xs mt-0.5 font-mono">{message}</p>;
}
