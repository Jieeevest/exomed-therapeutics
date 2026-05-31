import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/store/useTheme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        'p-2 rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]',
        className,
      )}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </motion.button>
  )
}
