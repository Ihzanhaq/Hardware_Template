import { useEffect, useState } from 'react'
import { lifestyle } from '../lib/images.js'

/**
 * Resilient image: shows the real source, and if it ever fails to load,
 * gracefully falls back to a keyword-matched photo so the UI never displays
 * a broken image.
 */
export default function Img({
  src,
  alt = '',
  className = '',
  fallbackKeywords = 'tools,hardware',
  fallbackSize = { w: 800, h: 1000 },
  loading = 'lazy',
  draggable = false,
  innerRef,
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [stage, setStage] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setStage(0)
    setLoaded(false)
  }, [src])

  const handleError = () => {
    if (stage === 0) {
      setStage(1)
      setCurrentSrc(lifestyle(fallbackKeywords, { ...fallbackSize, lock: 7 }))
    } else if (stage === 1) {
      setStage(2)
      setCurrentSrc(`https://picsum.photos/seed/forge-${Math.abs(hash(alt))}/${fallbackSize.w}/${fallbackSize.h}`)
    }
  }

  return (
    <img
      ref={innerRef}
      src={currentSrc}
      alt={alt}
      loading={loading}
      draggable={draggable}
      onError={handleError}
      onLoad={() => setLoaded(true)}
      data-loaded={loaded ? 'true' : 'false'}
      className={className}
      {...rest}
    />
  )
}

function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return h || 1
}
