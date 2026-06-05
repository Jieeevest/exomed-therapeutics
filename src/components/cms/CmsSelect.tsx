import ReactSelect, { type StylesConfig, type GroupBase } from 'react-select'

export interface SelectOption {
  value: string
  label: string
}

interface CmsSelectProps {
  options: SelectOption[]
  value: SelectOption | null
  onChange: (opt: SelectOption | null) => void
  placeholder?: string
  isSearchable?: boolean
  className?: string
}

function useSelectStyles<T extends SelectOption>(): StylesConfig<T, false, GroupBase<T>> {
  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: 'hsl(var(--background))',
      borderColor: state.isFocused ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))',
      borderRadius: '0.75rem',
      boxShadow: 'none',
      minHeight: '36px',
      fontSize: '0.875rem',
      '&:hover': { borderColor: 'hsl(var(--primary) / 0.4)' },
    }),
    valueContainer: (base) => ({ ...base, padding: '0 12px' }),
    singleValue: (base) => ({ ...base, color: 'hsl(var(--foreground))' }),
    placeholder: (base) => ({ ...base, color: 'hsl(var(--muted-foreground) / 0.5)', fontSize: '0.875rem' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, color: 'hsl(var(--muted-foreground))', padding: '0 8px' }),
    clearIndicator: (base) => ({ ...base, color: 'hsl(var(--muted-foreground))', padding: '0 4px' }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      zIndex: 50,
    }),
    menuList: (base) => ({ ...base, padding: '4px' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary) / 0.1)'
        : state.isFocused
        ? 'hsl(var(--muted) / 0.4)'
        : 'transparent',
      color: state.isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      padding: '6px 10px',
      cursor: 'pointer',
      '&:active': { backgroundColor: 'hsl(var(--muted))' },
    }),
    noOptionsMessage: (base) => ({ ...base, color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem' }),
  }
}

export function CmsSelect({ options, value, onChange, placeholder = 'Pilih...', isSearchable = false, className }: CmsSelectProps) {
  const styles = useSelectStyles<SelectOption>()
  return (
    <ReactSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      styles={styles}
      className={className}
      classNamePrefix="cms-select"
    />
  )
}
