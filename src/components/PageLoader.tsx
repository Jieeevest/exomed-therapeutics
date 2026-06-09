import { AnimatePresence, motion } from 'framer-motion'
import { Spinner } from '@/components/Spinner'
import { usePageLoader } from '@/store/usePageLoader'

export function PageLoader() {
  const loading = usePageLoader((s) => s.count > 0)

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#050505]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Spinner size="lg" color="primary" />
          <p className="text-sm font-semibold text-gray-400 dark:text-slate-500 tracking-wide">
            Loading...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
