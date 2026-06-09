import { Database } from 'lucide-react'

interface SectionEmptyProps {
  message?: string
}

export function SectionEmpty({ message = 'Data belum tersedia' }: SectionEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-black/[0.07] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
      <div className="w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center mb-4">
        <Database className="w-5 h-5 text-gray-300 dark:text-slate-600" />
      </div>
      <p className="text-sm font-semibold text-gray-400 dark:text-slate-500">{message}</p>
    </div>
  )
}
