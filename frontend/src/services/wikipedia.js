// -----------------------------------------------------------------------
// LIVE IMAGE LOOKUP — Wikipedia API
// -----------------------------------------------------------------------
// Fetches a real photo for a place directly from Wikipedia at runtime
// (no API key needed, CORS-enabled via origin=*). Used for both the
// curated destinations and any place found through live search, so
// images always reflect the real place rather than a stock photo.
// -----------------------------------------------------------------------

const ENDPOINT = 'https://en.wikipedia.org/w/api.php'
const imageCache = new Map()

export async function fetchWikiImage(title, size = 900) {
  if (!title) return null
  const key = `${title}|${size}`
  if (imageCache.has(key)) return imageCache.get(key)

  try {
    const params = new URLSearchParams({
      action: 'query',
      prop: 'pageimages',
      format: 'json',
      piprop: 'thumbnail',
      pithumbsize: String(size),
      titles: title,
      redirects: '1',
      origin: '*'
    })
    const res = await fetch(`${ENDPOINT}?${params.toString()}`)
    if (!res.ok) throw new Error('Wikipedia request failed')
    const data = await res.json()
    const pages = data?.query?.pages
    const page = pages ? Object.values(pages)[0] : null
    const url = page?.thumbnail?.source || null
    imageCache.set(key, url)
    return url
  } catch (err) {
    imageCache.set(key, null)
    return null
  }
}
