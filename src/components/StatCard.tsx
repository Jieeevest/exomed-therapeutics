import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  up?: boolean
  icon?: React.ReactNode
  accentColor?: string
  className?: string
}

export function StatCard({ label, value, change, up, icon, accentColor = 'bg-primary/5', className }: StatCardProps) {
  return (
    <div className={cn('bg-[#0a0a0a] border border-white/5 p-5 rounded-2xl relative overflow-hidden group', className)}>
      <div className={cn('absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-10 transition-colors', accentColor, 'group-hover:opacity-150')} />

      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>

      <div className="text-4xl font-black text-foreground">{value}</div>

      {change !== undefined && (
        <div className={cn('text-xs font-semibold mt-1.5', up ? 'text-green-400' : 'text-red-400')}>
          {change}
        </div>
      )}
    </div>
  )
}
