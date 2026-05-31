import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  resizable?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, resizable = false, className, id, ...props }, ref) => {
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
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[#0a0a0a] border text-white text-sm rounded-2xl px-4 py-3.5 outline-none transition-all placeholder:text-white/20 font-sans',
            error
              ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
              : 'border-white/10 focus:border-primary/50 focus:bg-[#111] focus:ring-4 focus:ring-primary/10',
            resizable ? 'resize-y' : 'resize-none',
            className
          )}
          {...props}
        />
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

Textarea.displayName = 'Textarea'
