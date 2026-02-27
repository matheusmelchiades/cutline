import { Link, useLocation } from 'react-router-dom'
import { Trophy, SlidersHorizontal, Calendar, Grid2X2 } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { label: 'Rankings', to: '/', icon: Trophy },
  { label: 'Simulator', to: '/simulator', icon: SlidersHorizontal },
  { label: 'Calendar', to: '/calendar', icon: Calendar },
  { label: 'More', to: '#', icon: Grid2X2 },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-input bg-surface-card md:hidden">
      <div className="flex h-16 items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = item.to !== '#' && location.pathname === item.to
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium transition-colors',
                isActive ? 'text-brand-500' : 'text-text-3'
              )}
            >
              <Icon size={22} />
              <span>{item.label}</span>
              {isActive && (
                <div className="mx-auto mt-0.5 h-1 w-1 rounded-full bg-brand-500" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
