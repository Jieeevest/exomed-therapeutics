import { cn } from '@/lib/utils'

const sizes = {
  sm:  'w-6 h-6 text-[10px]',
  md:  'w-7 h-7 text-xs',
  lg:  'w-10 h-10 text-sm',
  xl:  'w-16 h-16 text-2xl',
}

const gradients = [
  'from-amber-600 to-yellow-500',
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-indigo-500',
  'from-violet-600 to-purple-500',
  'from-pink-600 to-rose-500',
  'from-orange-600 to-amber-500',
]

interface AvatarProps {
  name?: string
  size?: keyof typeof sizes
  className?: string
  useGold?: boolean
}

export function Avatar({ name, size = 'md', className, useGold = false }: AvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? 'U'

  const gradientIndex = name
    ? name.charCodeAt(0) % gradients.length
    : 0

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shadow-inner shrink-0',
        useGold ? 'bg-gold-gradient' : `bg-gradient-to-br ${gradients[gradientIndex]}`,
        sizes[size],
        className
      )}
    >
      {initial}
    </div>
  )
}
