import { cn } from '@/lib/utils'

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-[3px]',
}

interface SpinnerProps {
  size?: keyof typeof sizes
  className?: string
  color?: 'primary' | 'black' | 'white'
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-spin border-transparent',
        sizes[size],
        color === 'primary' && 'border-t-primary',
        color === 'black'   && 'border-t-black',
        color === 'white'   && 'border-t-white',
        className
      )}
    />
  )
}
