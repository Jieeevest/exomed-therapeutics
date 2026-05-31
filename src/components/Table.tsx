import { cn } from '@/lib/utils'
import { Spinner } from '@/components/Spinner'

interface TableProps {
  children: React.ReactNode
  loading?: boolean
  className?: string
}

function TableRoot({ children, loading, className }: TableProps) {
  return (
    <div className={cn('bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden', className)}>
      {loading && (
        <div className="absolute inset-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <Spinner size="lg" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          {children}
        </table>
      </div>
    </div>
  )
}

function Head({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5">
      <tr>{children}</tr>
    </thead>
  )
}

function HeadCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn('px-6 py-4 font-semibold text-xs uppercase tracking-wider', className)}>
      {children}
    </th>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-white/5">{children}</tbody>
}

function Row({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'hover:bg-white/[0.02] transition-colors',
        onClick && 'cursor-pointer hover:bg-white/[0.05]',
        className
      )}
    >
      {children}
    </tr>
  )
}

function Cell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-6 py-4', className)}>{children}</td>
}

function Empty({ colSpan, message = 'Tidak ada data.' }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center text-slate-500 text-sm">
        {message}
      </td>
    </tr>
  )
}

export const Table = Object.assign(TableRoot, { Head, HeadCell, Body, Row, Cell, Empty })
