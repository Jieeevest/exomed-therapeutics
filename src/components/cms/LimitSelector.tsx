interface LimitSelectorProps {
  value: number
  onChange: (v: number) => void
}

export function LimitSelector({ value, onChange }: LimitSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="font-semibold">Tampilkan:</span>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary/40 transition-colors"
      >
        {[5, 10, 20, 50, 100].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  )
}
