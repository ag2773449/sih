import { useEffect, useState } from 'react'
import { fetchWikiImage } from '../services/wikipedia'

function fallbackFor(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || 'accessgo')}/900/700`
}

// Resolves a real photo for `title` via Wikipedia at mount time.
// Returns the deterministic placeholder immediately, then swaps in the
// live photo once it resolves (or keeps the placeholder if none exists).
export function useWikiImage(title, fallbackSeed) {
  const [src, setSrc] = useState(fallbackFor(fallbackSeed || title))

  useEffect(() => {
    let active = true
    if (!title) return undefined
    fetchWikiImage(title).then((url) => {
      if (active && url) setSrc(url)
    })
    return () => {
      active = false
    }
  }, [title, fallbackSeed])

  return src
}
