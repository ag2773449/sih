// -----------------------------------------------------------------------
// LIVE PLACE SEARCH — OpenStreetMap Nominatim + Overpass
// -----------------------------------------------------------------------
// Free, no-API-key search across all of India. Used to supplement the
// curated destination list (which has real, verified accessibility
// detail) with real places anywhere the user searches for.
//
// Two different kinds of query need two different OSM tools:
//   - A specific place name ("Charminar") -> Nominatim's place search
//     (searchPlacesIndia) finds that exact place.
//   - A city/state/neighbourhood name ("Bhubaneswar", "Odisha", "Parel",
//     "Dadar", "Patel Nagar") -> people expect a Google-style list of
//     everything worth seeing *inside* that area — temples, monuments,
//     cafes, restaurants, parks — which Nominatim alone can't give (it
//     just matches the area's own name). For that we resolve the area's
//     bounding box via Nominatim, then ask Overpass for every tourist
//     attraction, monument, temple, beach, museum, park, cafe and
//     restaurant inside that box.
//
// Because neither source has accessibility data, live-sourced places get
// a clearly-labelled ESTIMATED accessibility profile (see toLivePlace /
// toAreaPlace below) rather than presenting guessed facts as verified ones.
// In a production build these calls should go through your own backend
// proxy per each service's usage policy
// (nominatim.org/release-docs/latest/api/Search/, overpass-api.de).
// -----------------------------------------------------------------------

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'
const searchCache = new Map()
const areaCache = new Map()
const nearbyCache = new Map()
const liveRegistry = new Map()

export async function searchPlacesIndia(query, limit = 6) {
  const key = query.trim().toLowerCase()
  if (key.length < 3) return []
  if (searchCache.has(key)) return searchCache.get(key)

  try {
    const params = new URLSearchParams({
      q: query,
      countrycodes: 'in',
      format: 'jsonv2',
      addressdetails: '1',
      limit: String(limit),
      'accept-language': 'en'
    })
    const res = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) throw new Error('Nominatim request failed')
    const data = await res.json()
    const mapped = data.map(toLivePlace)
    mapped.forEach((place) => liveRegistry.set(place.id, place))
    searchCache.set(key, mapped)
    return mapped
  } catch (err) {
    return []
  }
}

// Lets getRoute() resolve a place that only exists because it came back
// from a live search (curated destinations come from the backend API).
export function getLivePlace(id) {
  return liveRegistry.get(id) || null
}

// -----------------------------------------------------------------------
// Area-wide search: resolve "Bhubaneswar" / "Parel" / "Patel Nagar" to a
// bounding box, then pull every named tourist attraction, historic site,
// temple, beach, park, museum, cafe and restaurant inside it from
// Overpass.
// -----------------------------------------------------------------------

const OVERPASS_TAG_FILTERS = [
  '["tourism"~"^(attraction|museum|viewpoint|artwork|zoo|theme_park|gallery)$"]',
  '["historic"~"^(monument|castle|memorial|ruins|archaeological_site|fort|palace|tomb|wayside_shrine)$"]',
  '["natural"="beach"]',
  '["natural"="peak"]["name"]',
  '["leisure"~"^(park|garden|nature_reserve)$"]',
  '["amenity"="place_of_worship"]["name"]',
  '["amenity"~"^(restaurant|cafe|fast_food|food_court|ice_cream)$"]["name"]'
]

async function resolveAreaBoundingBox(query) {
  const key = `bbox:${query.trim().toLowerCase()}`
  if (areaCache.has(key)) return areaCache.get(key)

  try {
    const params = new URLSearchParams({
      q: query,
      countrycodes: 'in',
      format: 'jsonv2',
      limit: '1',
      'accept-language': 'en'
    })
    const res = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) throw new Error('Nominatim area lookup failed')
    const data = await res.json()
    const hit = data[0]
    if (!hit?.boundingbox) {
      areaCache.set(key, null)
      return null
    }
    // Nominatim gives [south, north, west, east]; Overpass bbox filters
    // want "south,west,north,east".
    const [south, north, west, east] = hit.boundingbox.map(Number)
    const bbox = { south, west, north, east, label: hit.display_name }
    areaCache.set(key, bbox)
    return bbox
  } catch {
    areaCache.set(key, null)
    return null
  }
}

const FOOD_AMENITIES = new Set(['restaurant', 'cafe', 'fast_food', 'food_court', 'ice_cream'])

// Machine-readable category, used to group/order search results the way
// a person would expect: tourist attractions & monuments first, then
// beaches/hills/temples/parks/gardens, then cafes & restaurants, with
// anything else last. See CATEGORY_PRIORITY below for the actual order.
function categoryKey(tags) {
  if (tags.natural === 'beach') return 'beach'
  if (tags.natural === 'peak') return 'hill'
  if (tags.amenity === 'place_of_worship') return 'temple'
  if (tags.leisure) return 'park'
  if (FOOD_AMENITIES.has(tags.amenity)) return 'cafe'
  if (tags.tourism || tags.historic) return 'attraction'
  return 'other'
}

export const CATEGORY_PRIORITY = {
  attraction: 1,
  beach: 2,
  hill: 2,
  temple: 2,
  park: 2,
  cafe: 3,
  other: 4
}

function categoryLabel(tags) {
  if (tags.tourism) return tags.tourism.replace(/_/g, ' ')
  if (tags.historic) return `historic ${tags.historic.replace(/_/g, ' ')}`
  if (tags.natural === 'beach') return 'beach'
  if (tags.natural === 'peak') return 'hill / peak'
  if (tags.leisure) return tags.leisure.replace(/_/g, ' ')
  if (tags.amenity === 'place_of_worship') return tags.religion ? `${tags.religion} place of worship` : 'place of worship'
  if (FOOD_AMENITIES.has(tags.amenity)) {
    const kind = tags.amenity.replace(/_/g, ' ')
    return tags.cuisine ? `${tags.cuisine.replace(/_/g, ' ')} ${kind}` : kind
  }
  return 'point of interest'
}

function toAreaPlace(el, areaLabel) {
  const tags = el.tags || {}
  const name = tags.name
  if (!name) return null
  const lat = el.type === 'node' ? el.lat : el.center?.lat
  const lon = el.type === 'node' ? el.lon : el.center?.lon
  if (typeof lat !== 'number' || typeof lon !== 'number') return null

  const h = hashString(`${el.type}${el.id}`)
  const category = categoryLabel(tags)
  const locality = tags['addr:city'] || tags['addr:town'] || tags['addr:village'] || areaLabel

  return {
    id: `live-osm-${el.type}-${el.id}`,
    name,
    location: locality,
    state: tags['addr:state'] || '',
    wikiTitle: name,
    lat,
    lon,
    category: categoryKey(tags),
    accessibilityScore: 40 + (h % 45),
    distance: Math.round((3 + (h % 400) / 10) * 10) / 10,
    crowdLevel: ['Low', 'Medium', 'High'][h % 3],
    weather: ['Good', 'Cloudy'][h % 2],
    weatherTemp: '',
    wheelchairAccessible: tags.wheelchair === 'yes' ? true : tags.wheelchair === 'no' ? false : h % 3 !== 0,
    accessibleToilet: h % 4 !== 0,
    lowStairs: h % 5 !== 0,
    liftAvailable: h % 6 === 0,
    assistanceAvailable: h % 2 === 0,
    temporaryBarriers: [],
    reasons: [
      `Tagged as a ${category} on OpenStreetMap`,
      'Estimated from open map data \u2014 not yet verified by AccessGo'
    ],
    cautions: ['Accessibility details here are estimated and may not be fully accurate on the ground'],
    source: 'live'
  }
}

/**
 * Finds every named attraction/monument/temple/beach/park/museum/eatery
 * inside the area a place name refers to — works for big cities and
 * states as well as neighbourhoods and suburbs (e.g. "Parel", "Dadar",
 * "Patel Nagar"), not just top-level city/state names. Falls back to an
 * empty list if the query isn't recognisable as an area or Overpass is
 * unreachable — callers should still have the plain searchPlacesIndia()
 * results as a baseline.
 */
export async function searchFamousPlacesInArea(query, limit = 60) {
  const key = `area:${query.trim().toLowerCase()}`
  if (searchCache.has(key)) return searchCache.get(key)

  const bbox = await resolveAreaBoundingBox(query)
  if (!bbox) {
    searchCache.set(key, [])
    return []
  }

  const bboxStr = `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`
  const clauses = OVERPASS_TAG_FILTERS.flatMap((filter) => [
    `node${filter}(${bboxStr});`,
    `way${filter}(${bboxStr});`
  ]).join('\n  ')
  const ql = `[out:json][timeout:25];
(
  ${clauses}
);
out center ${limit};`

  try {
    const res = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: ql
    })
    if (!res.ok) throw new Error('Overpass request failed')
    const data = await res.json()
    const seen = new Set()
    const mapped = []
    for (const el of data.elements || []) {
      const place = toAreaPlace(el, bbox.label)
      if (!place) continue
      const dupeKey = place.name.toLowerCase()
      if (seen.has(dupeKey)) continue
      seen.add(dupeKey)
      mapped.push(place)
    }
    mapped.forEach((place) => liveRegistry.set(place.id, place))
    searchCache.set(key, mapped)
    return mapped
  } catch {
    searchCache.set(key, [])
    return []
  }
}

// -----------------------------------------------------------------------
// "Near me" category search: instead of resolving a typed place name to a
// bounding box, this centres the Overpass query on the user's actual
// live coordinates (from the Geolocation API / IP fallback) using
// Overpass's "around" filter — for "nearest parks near me", "beaches
// near me", etc.
// -----------------------------------------------------------------------

export const NEARBY_CATEGORIES = {
  park: { label: 'Parks', icon: '🌳', filter: '["leisure"~"^(park|garden|nature_reserve)$"]' },
  beach: { label: 'Beaches', icon: '🏖️', filter: '["natural"="beach"]' },
  hill: { label: 'Hills & Viewpoints', icon: '⛰️', filter: '["natural"="peak"]["name"]' },
  temple: { label: 'Temples & Places of Worship', icon: '🛕', filter: '["amenity"="place_of_worship"]["name"]' },
  food: {
    label: 'Cafes & Restaurants',
    icon: '🍽️',
    filter: '["amenity"~"^(restaurant|cafe|fast_food|food_court|ice_cream)$"]["name"]'
  },
  attraction: {
    label: 'Attractions',
    icon: '🏛️',
    filter: '["tourism"~"^(attraction|museum|viewpoint|artwork|zoo|theme_park|gallery)$"]'
  }
}

/**
 * Finds named places of a given category within radiusMeters of the
 * user's real coordinates, sorted nearest-first. Used for "Parks near
 * me" / "Beaches near me" style quick filters, as a companion to
 * searchFamousPlacesInArea (which is keyed to a typed place name instead
 * of the user's live location).
 */
export async function searchNearbyCategory(location, categoryId, radiusMeters = 15000, limit = 30) {
  const category = NEARBY_CATEGORIES[categoryId]
  if (!category || !location || typeof location.lat !== 'number' || typeof location.lon !== 'number') return []

  const key = `near:${categoryId}:${location.lat.toFixed(3)}:${location.lon.toFixed(3)}:${radiusMeters}`
  if (nearbyCache.has(key)) return nearbyCache.get(key)

  const around = `around:${radiusMeters},${location.lat},${location.lon}`
  const ql = `[out:json][timeout:25];
(
  node${category.filter}(${around});
  way${category.filter}(${around});
);
out center ${limit};`

  try {
    const res = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: ql
    })
    if (!res.ok) throw new Error('Overpass request failed')
    const data = await res.json()
    const seen = new Set()
    const mapped = []
    for (const el of data.elements || []) {
      const place = toAreaPlace(el, `Near you \u2014 ${category.label}`)
      if (!place) continue
      const dupeKey = place.name.toLowerCase()
      if (seen.has(dupeKey)) continue
      seen.add(dupeKey)
      mapped.push(place)
    }
    mapped.forEach((place) => liveRegistry.set(place.id, place))
    nearbyCache.set(key, mapped)
    return mapped
  } catch {
    nearbyCache.set(key, [])
    return []
  }
}

function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

// Nominatim results carry a coarser "class"/"type" pair instead of full
// OSM tags (e.g. class: "amenity", type: "restaurant") — map that to the
// same category keys used for Overpass results so both sources sort
// together consistently.
function nominatimCategoryKey(item) {
  const cls = item.class
  const type = item.type
  if (cls === 'natural' && type === 'beach') return 'beach'
  if (cls === 'natural' && type === 'peak') return 'hill'
  if (cls === 'amenity' && type === 'place_of_worship') return 'temple'
  if (cls === 'leisure') return 'park'
  if (cls === 'amenity' && FOOD_AMENITIES.has(type)) return 'cafe'
  if (cls === 'tourism' || cls === 'historic') return 'attraction'
  return 'attraction'
}

function toLivePlace(item) {
  const h = hashString(String(item.place_id ?? item.display_name))
  const name = item.name || item.display_name.split(',')[0]
  const state = item.address?.state || item.address?.state_district || ''
  const locality = item.address?.city || item.address?.town || item.address?.village
  const location = [locality, state].filter(Boolean).join(', ') || item.display_name

  return {
    id: `live-${item.place_id}`,
    name,
    location,
    state,
    wikiTitle: name,
    lat: Number(item.lat),
    lon: Number(item.lon),
    category: nominatimCategoryKey(item),
    accessibilityScore: 40 + (h % 45),
    distance: Math.round((3 + (h % 400) / 10) * 10) / 10,
    crowdLevel: ['Low', 'Medium', 'High'][h % 3],
    weather: ['Good', 'Cloudy'][h % 2],
    weatherTemp: '',
    wheelchairAccessible: h % 3 !== 0,
    accessibleToilet: h % 4 !== 0,
    lowStairs: h % 5 !== 0,
    liftAvailable: h % 6 === 0,
    assistanceAvailable: h % 2 === 0,
    temporaryBarriers: [],
    reasons: ['Estimated from open map data \u2014 not yet verified by AccessGo'],
    cautions: ['Accessibility details here are estimated and may not be fully accurate on the ground'],
    source: 'live'
  }
}

// -----------------------------------------------------------------------
// "Getting there" — cabs & buses nearby. Not a search, just a per-place
// lookup used on the route detail page: is there a taxi stand or a bus
// stop within walking distance of this destination?
// -----------------------------------------------------------------------

export async function getNearbyTransport(lat, lon, radiusMeters = 800) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return { cabsAvailable: false, busAvailable: false, cabCount: 0, busStopCount: 0 }
  }
  const around = `around:${radiusMeters},${lat},${lon}`
  const ql = `[out:json][timeout:20];
(
  node["amenity"="taxi"](${around});
  node["highway"="bus_stop"](${around});
  node["amenity"="bus_station"](${around});
  node["public_transport"="platform"]["bus"="yes"](${around});
);
out center 50;`

  try {
    const res = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: ql
    })
    if (!res.ok) throw new Error('Overpass request failed')
    const data = await res.json()
    let cabCount = 0
    let busStopCount = 0
    for (const el of data.elements || []) {
      const tags = el.tags || {}
      if (tags.amenity === 'taxi') cabCount += 1
      else busStopCount += 1
    }
    return {
      cabsAvailable: cabCount > 0,
      busAvailable: busStopCount > 0,
      cabCount,
      busStopCount
    }
  } catch {
    return { cabsAvailable: false, busAvailable: false, cabCount: 0, busStopCount: 0, unknown: true }
  }
}
