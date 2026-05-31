import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, iconLeft, iconRight, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative group/input">
          {iconLeft && (
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within/input:text-primary transition-colors">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[#0a0a0a] border text-white text-sm rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-white/20',
              error
                ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                : 'border-white/10 focus:border-primary/50 focus:bg-[#111] focus:ring-4 focus:ring-primary/10',
              iconLeft  && 'pl-12',
              iconRight && 'pr-12',
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground group-focus-within/input:text-primary transition-colors">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-400 font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
