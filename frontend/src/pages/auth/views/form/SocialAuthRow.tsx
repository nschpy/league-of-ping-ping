import { Button } from '@/components/ui/button';

export function SocialAuthRow() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant="outline" disabled type="button">
        Google
      </Button>
      <Button variant="outline" disabled type="button">
        GitHub
      </Button>
    </div>
  );
}
