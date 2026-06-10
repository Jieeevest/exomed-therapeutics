import ReactSelect, { type GroupBase, type Props as ReactSelectProps, type StylesConfig } from 'react-select'
import { cn } from '@/lib/utils'

export interface SelectOption<V = string> {
  value: V
  label: string
}

const buildPublicStyles = <V, IsMulti extends boolean>(): StylesConfig<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>> => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: 'hsl(var(--background))',
    borderColor: state.isFocused ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
    borderRadius: '1rem',
    padding: '0.25rem 0.25rem',
    boxShadow: state.isFocused ? '0 0 0 4px hsl(var(--primary) / 0.1)' : 'none',
    minHeight: '48px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
    },
  }),
  valueContainer: (base) => ({ ...base, padding: '0 0.5rem', gap: '4px' }),
  singleValue: (base) => ({ ...base, color: 'hsl(var(--foreground))', fontSize: '0.875rem' }),
  placeholder: (base) => ({ ...base, color: 'hsl(var(--muted-foreground) / 0.5)', fontSize: '0.875rem' }),
  input: (base) => ({ ...base, color: 'hsl(var(--foreground))', fontSize: '0.875rem' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
    transition: 'color 150ms, transform 200ms',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': { color: 'hsl(var(--foreground))' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    '&:hover': { color: 'hsl(var(--foreground))' },
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    zIndex: 50,
  }),
  menuList: (base) => ({ ...base, padding: '4px', maxHeight: '240px' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'hsl(var(--primary) / 0.15)'
      : state.isFocused
        ? 'hsl(var(--muted) / 0.5)'
        : 'transparent',
    color: state.isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 600 : 400,
    '&:active': { backgroundColor: 'hsl(var(--primary) / 0.2)' },
  }),
  noOptionsMessage: (base) => ({ ...base, color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }),
  loadingMessage: (base) => ({ ...base, color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }),
  groupHeading: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '8px 12px 4px',
  }),
})

const buildStyles = <V, IsMulti extends boolean>(compact = false): StylesConfig<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>> => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: 'hsl(var(--background))',
    borderColor: state.isFocused ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
    borderRadius: compact ? '0.5rem' : '0.75rem',
    padding: compact ? '0' : '0.25rem 0.25rem',
    boxShadow: state.isFocused ? '0 0 0 4px hsl(var(--primary) / 0.1)' : 'none',
    minHeight: compact ? '34px' : '40px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: compact ? '0 0.5rem' : '0 0.5rem',
    gap: '4px',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'hsl(var(--foreground))',
    fontSize: compact ? '0.75rem' : '0.875rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'hsl(var(--primary) / 0.15)',
    borderRadius: '0.5rem',
    border: '1px solid hsl(var(--primary) / 0.3)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'hsl(var(--primary))',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '2px 6px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'hsl(var(--primary) / 0.7)',
    borderRadius: '0 0.4rem 0.4rem 0',
    '&:hover': {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
      color: 'hsl(var(--primary))',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground) / 0.5)',
    fontSize: compact ? '0.75rem' : '0.875rem',
  }),
  input: (base) => ({
    ...base,
    color: 'hsl(var(--foreground))',
    fontSize: compact ? '0.75rem' : '0.875rem',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    padding: compact ? '4px' : '8px',
    color: state.isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
    transition: 'color 150ms, transform 200ms',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': { color: 'hsl(var(--foreground))' },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: compact ? '4px' : '8px',
    color: 'hsl(var(--muted-foreground))',
    '&:hover': { color: 'hsl(var(--foreground))' },
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    padding: '4px',
    maxHeight: '240px',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? 'hsl(var(--primary) / 0.15)'
      : state.isFocused
        ? 'hsl(var(--muted) / 0.5)'
        : 'transparent',
    color: state.isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
    fontSize: compact ? '0.75rem' : '0.875rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 600 : 400,
    '&:active': {
      backgroundColor: 'hsl(var(--primary) / 0.2)',
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: compact ? '0.75rem' : '0.875rem',
  }),
  loadingMessage: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: compact ? '0.75rem' : '0.875rem',
  }),
  groupHeading: (base) => ({
    ...base,
    color: 'hsl(var(--muted-foreground))',
    fontSize: '0.65rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: '8px 12px 4px',
  }),
})

interface SelectProps<V = string, IsMulti extends boolean = false>
  extends Omit<ReactSelectProps<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>>, 'styles' | 'classNamePrefix'> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
  variant?: 'public'
  compact?: boolean
  required?: boolean
}

export function Select<V = string, IsMulti extends boolean = false>({
  label,
  error,
  hint,
  wrapperClassName,
  inputId,
  variant,
  compact,
  required,
  ...props
}: SelectProps<V, IsMulti>) {
  const id = inputId ?? label?.toLowerCase().replace(/\s+/g, '-')
  const styles = variant === 'public' ? buildPublicStyles<V, IsMulti>() : buildStyles<V, IsMulti>(compact)

  return (
    <div className={cn('space-y-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <ReactSelect<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>>
        inputId={id}
        styles={styles}
        classNamePrefix="rs"
        noOptionsMessage={() => 'Tidak ada pilihan'}
        loadingMessage={() => 'Memuat...'}
        {...props}
      />
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
