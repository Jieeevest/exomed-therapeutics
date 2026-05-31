import ReactSelect, { type GroupBase, type Props as ReactSelectProps, type StylesConfig } from 'react-select'
import { cn } from '@/lib/utils'

export interface SelectOption<V = string> {
  value: V
  label: string
}

const buildStyles = <V, IsMulti extends boolean>(): StylesConfig<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>> => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: '#0a0a0a',
    borderColor: state.isFocused ? 'hsl(45 93% 47% / 0.5)' : 'rgb(255 255 255 / 0.1)',
    borderRadius: '1rem',
    padding: '0.25rem 0.25rem',
    boxShadow: state.isFocused ? '0 0 0 4px hsl(45 93% 47% / 0.1)' : 'none',
    minHeight: '48px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: state.isFocused ? 'hsl(45 93% 47% / 0.5)' : 'rgb(255 255 255 / 0.2)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 0.5rem',
    gap: '4px',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
    fontSize: '0.875rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'hsl(45 93% 47% / 0.15)',
    borderRadius: '0.5rem',
    border: '1px solid hsl(45 93% 47% / 0.3)',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'hsl(45 93% 47%)',
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '2px 6px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'hsl(45 93% 47% / 0.7)',
    borderRadius: '0 0.4rem 0.4rem 0',
    '&:hover': {
      backgroundColor: 'hsl(45 93% 47% / 0.2)',
      color: 'hsl(45 93% 47%)',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgb(255 255 255 / 0.2)',
    fontSize: '0.875rem',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
    fontSize: '0.875rem',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? 'hsl(45 93% 47%)' : 'rgb(148 163 184)',
    transition: 'color 150ms, transform 200ms',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    '&:hover': { color: 'white' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: 'rgb(148 163 184)',
    '&:hover': { color: 'white' },
    cursor: 'pointer',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#0a0a0a',
    border: '1px solid rgb(255 255 255 / 0.1)',
    borderRadius: '0.75rem',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
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
      ? 'hsl(45 93% 47% / 0.15)'
      : state.isFocused
        ? 'rgb(255 255 255 / 0.05)'
        : 'transparent',
    color: state.isSelected ? 'hsl(45 93% 47%)' : 'rgb(203 213 225)',
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 600 : 400,
    '&:active': {
      backgroundColor: 'hsl(45 93% 47% / 0.2)',
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: 'rgb(100 116 139)',
    fontSize: '0.875rem',
  }),
  loadingMessage: (base) => ({
    ...base,
    color: 'rgb(100 116 139)',
    fontSize: '0.875rem',
  }),
  groupHeading: (base) => ({
    ...base,
    color: 'rgb(100 116 139)',
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
}

export function Select<V = string, IsMulti extends boolean = false>({
  label,
  error,
  hint,
  wrapperClassName,
  inputId,
  ...props
}: SelectProps<V, IsMulti>) {
  const id = inputId ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('space-y-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={id} className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {label}
        </label>
      )}
      <ReactSelect<SelectOption<V>, IsMulti, GroupBase<SelectOption<V>>>
        inputId={id}
        styles={buildStyles<V, IsMulti>()}
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
