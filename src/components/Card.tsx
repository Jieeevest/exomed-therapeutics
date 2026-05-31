import { cn } from '@/lib/utils'

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

interface CardProps {
  children: React.ReactNode
  hover?: boolean
  padding?: keyof typeof paddings
  className?: string
}

function CardRoot({ children, hover, padding = 'md', className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-xl relative overflow-hidden',
        hover && 'group transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.05]',
        paddings[padding],
        className
      )}
    >
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      {children}
    </div>
  )
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-b border-border pb-4 mb-4', className)}>
      {children}
    </div>
  )
}

function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border-t border-border pt-4 mt-4 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  )
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Footer: CardFooter,
})
