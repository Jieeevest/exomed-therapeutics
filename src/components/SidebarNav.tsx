import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: React.ReactNode
}

interface SidebarNavProps {
  items: NavItem[]
  activeId: string
  onSelect: (id: string) => void
  className?: string
}

export function SidebarNav({ items, activeId, onSelect, className }: SidebarNavProps) {
  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeId === item.id

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border',
              isActive
                ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.08)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border-transparent'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-slate-500')} />
              {item.label}
            </div>
            <div className="flex items-center gap-1.5">
              {item.badge}
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </div>
          </button>
        )
      })}
    </nav>
  )
}
