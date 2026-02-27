import { cn } from '@/lib/cn'

interface PillFiltersProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}

export function PillFilters({ options, value, onChange }: PillFiltersProps) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
            option.value === value
              ? 'bg-brand-500 text-white'
              : 'bg-surface-input text-text-2 hover:text-text-1'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
