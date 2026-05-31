import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  success: { classes: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: CheckCircle },
  error:   { classes: 'bg-red-500/10 border-red-500/20 text-red-400',             icon: AlertCircle },
  warning: { classes: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',    icon: AlertTriangle },
  info:    { classes: 'bg-blue-500/10 border-blue-500/20 text-blue-400',           icon: Info },
}

interface AlertProps {
  variant?: keyof typeof variants
  message: string | null | undefined
  className?: string
}

export function Alert({ variant = 'error', message, className }: AlertProps) {
  const cfg = variants[variant]
  const Icon = cfg.icon

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.95 }}
          animate={{ opacity: 1, height: 'auto', scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.95 }}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl border text-sm overflow-hidden',
            cfg.classes,
            className
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
