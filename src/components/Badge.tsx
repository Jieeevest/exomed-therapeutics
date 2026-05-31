import { cn } from '@/lib/utils'

const variants = {
  success:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning:     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error:       'bg-red-500/10 text-red-400 border-red-500/20',
  info:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
  muted:       'bg-slate-500/10 text-slate-400 border-slate-500/20',
  pro:         'bg-purple-500/10 text-purple-400 border-purple-500/20',
  primary:     'bg-primary/10 text-primary border-primary/20',
  amber:       'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

const sizes = {
  sm: 'text-[9px] px-1.5 py-0.5',
  md: 'text-[10px] px-2.5 py-1',
}

interface BadgeProps {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'muted', size = 'md', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-black uppercase tracking-wider rounded-md border',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
