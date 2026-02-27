import { Link, useLocation } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_LINKS = [
  { label: 'Rankings', to: '/' },
  { label: 'Simulator', to: '/simulator' },
  { label: 'Calendar', to: '/calendar' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-surface-input bg-surface-card px-4">
      {/* Logo */}
      <Link to="/" className="text-lg font-bold text-text-1">
        Cutline
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              'text-[15px] font-medium transition-colors',
              location.pathname === link.to
                ? 'text-brand-500'
                : 'text-text-2 hover:text-text-1'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Settings */}
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-2 transition-colors hover:bg-surface-input hover:text-text-1"
        aria-label="Settings"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}
