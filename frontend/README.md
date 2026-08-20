# AccessGo — Accessible Journey Planner

Frontend prototype for **SOAIDEATHON-S20**: an accessible tourism journey planner for
wheelchair users, elderly people, visually impaired users, hearing-impaired users, and
travellers with other accessibility needs.

Built for the **M4 — Frontend/UI Developer** role: React + Vite + Tailwind CSS, fully
responsive, with reusable components and mock data structured so the real backend can be
dropped in later with minimal changes.

## Live data

Three things in this build are genuinely live, not mocked:

- **Search** — typing a query on Explore checks the curated (verified) destinations
  first, then supplements with real places anywhere in India via the free
  [OpenStreetMap Nominatim](https://nominatim.org/) API (no API key needed). So
  searching "Delhi", "Jaipur", "Kerala backwaters", etc. returns real matches even
  though only a handful of destinations are curated with full accessibility detail.
  Nominatim results carry no real accessibility data, so they're clearly labelled
  **"Estimated data"** on their card/route page rather than presented as verified —
  see `src/services/liveSearch.js`.
- **Images** — every destination photo (curated or live) is fetched at runtime from
  Wikipedia's public API by place name (`src/services/wikipedia.js`,
  `src/hooks/useWikiImage.js`). If Wikipedia has no image for a name, a deterministic
  placeholder is shown instead so the layout never breaks.
- **Distance** — every curated and live destination carries real lat/lon. The app asks
  the browser for the user's location (Geolocation API) and computes actual
  straight-line distance with the haversine formula (`src/services/geo.js`,
  `src/context/LocationContext.jsx`). If location access is denied or unavailable, cards
  fall back to an approximate distance and say so ("km (approx)") rather than silently
  showing a number as if it were exact.

Both calls run directly from the browser and need no backend or API key. For a
production deployment, route the Nominatim calls through your own backend per its
[usage policy](https://operations.osmfoundation.org/policies/nominatim/) (rate limits,
attribution, caching).

## Running locally

Requires [Node.js](https://nodejs.org) 18+ and an internet connection (for live search
and images — the app still works offline using the curated destinations and
placeholder images).

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## The demo flow

1. **Home (`/`)** — search a destination, pick an accessibility need, toggle preferences
   (wheelchair access, accessible toilet, low stairs, less crowded, lift, assistance),
   then **Find Accessible Journey**.
2. **Explore (`/explore`)** — recommended destinations as cards with an accessibility
   score, distance, crowd, weather and facility tags. Sort by best accessibility,
   nearest, least crowded, best weather, or assistance available.
3. **Route (`/route/:id`)** — a destination's accessible route: an illustrative map with
   accessible / caution / barrier path segments, "Why this route?", and any
   "Potential Barriers", with a **Report a Barrier** shortcut.
4. **Report Barrier (`/report-barrier`)** — form with validation (location, barrier
   type, description, confidence, optional photo). Submitting shows a confirmation
   state and the report enters **Under Verification**.
5. **Barrier Status (`/barrier-status`)** — every submitted report (seed data plus
   anything you just submitted) with a status badge: Pending, Under Verification,
   Verified, or Resolved. Your own submission is highlighted.

All state (search, selected need/preferences, submitted reports) lives in React context
for the session — see `src/context/`.

## Project structure

```
src/
  components/       Reusable UI components (Navbar, PlaceCard, RouteMap, BarrierForm, ...)
  pages/            One file per route (Home, Results, Route, ReportBarrier, BarrierStatus)
  context/          AccessibilityContext (text size / high contrast / reduced motion)
                     JourneyContext (search + preferences + barrier reports, session state)
  data/mockData.js  Mock destinations, barrier reports, and lookup lists
  services/api.js   Service layer — see "Connecting the backend" below
  index.css         Tailwind entry + accessibility mode styles + focus states
```

## Connecting the backend

All data access goes through **`src/services/api.js`** — no component talks to
`mockData.js` directly. Each function in that file is named after, and documents, the
real endpoint it stands in for:

| Function              | Endpoint                     |
|------------------------|------------------------------|
| `getPlaces()`           | `GET /places`                |
| `recommendJourney()`    | `POST /journey/recommend`    |
| `getRoute(id)`          | `GET /routes/:id`            |
| `submitBarrierReport()` | `POST /barriers`             |
| `getBarrierReports()`   | `GET /barriers`              |
| `getBarrierStatus(id)`  | `GET /barriers/:id/status`   |

`recommendJourney()` already blends in live OpenStreetMap results (see "Live data"
above) — when you connect a real backend, decide whether your backend should own that
blending server-side, or keep merging `src/services/liveSearch.js` results in on the
client alongside your backend's curated response.

To connect a real backend:

1. Set `VITE_API_BASE_URL` in a `.env` file (defaults to `/api`).
2. Replace each function body in `src/services/api.js` with a `fetch()`/`axios` call to
   the matching endpoint, keeping the same function signature and return shape.
3. No component changes should be required — pages already call these functions and
   render whatever they resolve with.

## Accessibility notes

- Semantic HTML (`<fieldset>`/`<legend>`, `<nav aria-label>`, `role="radiogroup"`,
  `aria-pressed`/`aria-checked`/`aria-invalid`, live regions on async content).
- Status, crowd, and facility indicators always pair an icon/label with colour — never
  colour alone.
- Visible focus outlines on every interactive element (see `index.css`); a skip-to-content
  link is the first focusable element on every page.
- The **Accessibility Settings** panel (navbar, all breakpoints) controls text size,
  high contrast, and reduced motion app-wide via `AccessibilityContext`.
- Destination images use `picsum.photos` seeded placeholders — swap for real photography
  or a CMS/API when available.

## Notes for the team

- `src/data/mockData.js` is the single place to add/edit demo destinations and barrier
  reports for the hackathon walkthrough.
- Tailwind tokens (colour palette, fonts, radii, shadows) live in `tailwind.config.js`.
