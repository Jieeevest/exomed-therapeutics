import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortableHeaderProps {
  label: string
  field: string
  sortBy: string
  sortDir: 'asc' | 'desc'
  onSort: (field: string) => void
  className?: string
}

export function SortableHeader({ label, field, sortBy, sortDir, onSort, className }: SortableHeaderProps) {
  const active = sortBy === field
  return (
    <th
      className={cn(
        'px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors',
        className,
      )}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="flex flex-col">
          <ChevronUp
            className={cn('w-2.5 h-2.5 -mb-0.5', active && sortDir === 'asc' ? 'text-primary' : 'text-muted-foreground/40')}
          />
          <ChevronDown
            className={cn('w-2.5 h-2.5', active && sortDir === 'desc' ? 'text-primary' : 'text-muted-foreground/40')}
          />
        </span>
      </span>
    </th>
  )
}
