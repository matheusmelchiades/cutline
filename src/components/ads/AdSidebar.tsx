import { useEffect, useRef } from 'react'

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
const SLOT = import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR as string | undefined

const isReady = CLIENT && CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX' && SLOT && SLOT !== 'XXXXXXXXXX'

export function AdSidebar() {
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    if (!isReady || !ref.current) return
    try {
      ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
      ;(window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({})
    } catch {
      // adsbygoogle not loaded yet
    }
  }, [])

  if (!isReady) {
    return (
      <div className="flex h-62.5 w-75 items-center justify-center rounded-lg border border-dashed border-surface-input bg-surface-card">
        <span className="text-[13px] text-text-muted">Advertisement</span>
      </div>
    )
  }

  return (
    <div className="w-75 overflow-hidden">
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'inline-block', width: '300px', height: '250px' }}
        data-ad-client={CLIENT}
        data-ad-slot={SLOT}
      />
    </div>
  )
}
