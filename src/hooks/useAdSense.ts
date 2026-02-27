import { useEffect } from 'react'

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined

export function useAdSense() {
  useEffect(() => {
    if (!CLIENT || CLIENT === 'ca-pub-XXXXXXXXXXXXXXXX') return

    const existing = document.querySelector('script[data-ad-client]')
    if (existing) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`
    script.crossOrigin = 'anonymous'
    script.dataset.adClient = CLIENT
    document.head.appendChild(script)
  }, [])
}
