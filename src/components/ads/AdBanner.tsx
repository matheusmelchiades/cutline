import { useEffect, useRef } from 'react'

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
const SLOT = import.meta.env.VITE_ADSENSE_SLOT_BANNER as string | undefined

const isReady = CLIENT && CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX' && SLOT && SLOT !== 'XXXXXXXXXX'

export function AdBanner() {
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
      <div className="flex h-12.5 w-full items-center justify-center rounded-lg border border-dashed border-surface-input bg-surface-card md:h-22.5">
        <span className="text-[13px] text-text-muted">Advertisement</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={CLIENT}
        data-ad-slot={SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
