import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

type TabVariant = 'underline' | 'pill'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onValueChange: (value: string) => void
  variant?: TabVariant
  children: React.ReactNode
  className?: string
}

export function Tabs({ tabs, value, onValueChange, variant = 'underline', children, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={cn('flex flex-col', className)}>
      <RadixTabs.List
        className={cn(
          'flex',
          variant === 'underline' && 'border-b border-border',
          variant === 'pill'      && 'gap-1 bg-white/[0.04] border border-white/10 p-1 rounded-xl w-fit'
        )}
      >
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.id}
            value={tab.id}
            className={cn(
              'flex items-center gap-1.5 font-medium text-sm transition-all outline-none relative',
              variant === 'underline' && [
                'flex-1 justify-center py-2 text-[11px] text-muted-foreground hover:text-foreground',
                'data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary',
              ],
              variant === 'pill' && [
                'px-4 py-2 rounded-lg text-muted-foreground hover:text-white',
                'data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow',
              ]
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {children}
    </RadixTabs.Root>
  )
}

export const TabContent = RadixTabs.Content
