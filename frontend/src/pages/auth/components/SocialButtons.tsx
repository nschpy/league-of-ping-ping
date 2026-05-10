import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

export function SocialButtons() {
  return (
    <TooltipProvider>
      <div className="flex gap-2.5">
        {['Google', 'Telegram'].map((name) => (
          <Tooltip key={name}>
            <TooltipTrigger asChild>
              <span className="flex-1 cursor-not-allowed">
                <Button variant="outline" className="w-full h-10 uppercase tracking-[0.12em] text-[13px] opacity-50" disabled>
                  {name}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>Скоро</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
