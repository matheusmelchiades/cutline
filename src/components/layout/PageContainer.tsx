import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function PageContainer({ children, sidebar }: PageContainerProps) {
  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-20 pt-4 md:pb-8">
      {sidebar ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>{children}</div>
          <aside className="hidden lg:block">{sidebar}</aside>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  )
}
