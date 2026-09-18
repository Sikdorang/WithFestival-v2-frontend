# Performance Checklist (Frontend)

Quick reference for Core Web Vitals and frontend performance. Use alongside `performance-optimization`. **Out of scope:** database query plans, connection pools, Redis — backend concerns.

## Core Web Vitals Targets

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## TTFB / Network (as seen from the browser)

When TTFB is slow (> 800ms), check DevTools Network waterfall:

- [ ] DNS — `dns-prefetch` / `preconnect` for known API/CDN origins
- [ ] TLS — HTTPS, HTTP/2+
- [ ] Payload — compress, cache, avoid oversized JSON on first paint

## Frontend Checklist

### Images
- [ ] Modern formats (WebP, AVIF)
- [ ] `srcset` / `sizes` where responsive
- [ ] Explicit `width` / `height` (or aspect-ratio) to prevent CLS
- [ ] Below-the-fold: `loading="lazy"` + `decoding="async"`
- [ ] LCP image: `fetchpriority="high"`, not lazy

### JavaScript
- [ ] Initial JS budget under ~200KB gzipped where practical
- [ ] Route-level code splitting (`import()` / Next dynamic)
- [ ] Tree-shaking friendly imports
- [ ] Long tasks (> 50ms) broken up (INP)
- [ ] Defer non-critical work (analytics) out of event handlers
- [ ] Third-party scripts audited and deferred

### CSS / Fonts
- [ ] No large unused CSS
- [ ] Fonts: WOFF2, limited weights, `font-display: swap`, preload critical faces
- [ ] Prefer shared tokens (`@repo/tailwind-config` in `app`)

### Rendering
- [ ] No layout thrashing
- [ ] Animations use `transform` / `opacity`
- [ ] Long lists virtualized when needed
- [ ] Avoid unnecessary full-tree re-renders (profile before memoizing)

### Caching (client / CDN)
- [ ] Static assets hashed + long cache
- [ ] React Query staleTimes intentional for `app`
- [ ] PWA Workbox strategies reviewed for `app` (stale vs network)

## Measurement Commands

```bash
# Lighthouse
npx lighthouse http://localhost:3000 --output json --output-path ./report-www.json
npx lighthouse http://localhost:5173 --output json --output-path ./report-app.json

# Vite bundle visualizer (app)
pnpm --filter app exec vite-bundle-visualizer

# Web Vitals in code
import { onLCP, onINP, onCLS } from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

## Common Frontend Anti-Patterns

| Anti-Pattern | Impact | Fix |
|---|---|---|
| Giant first-load bundle | Slow TTI / poor LCP | Code split routes and heavy libs |
| Unoptimized images | Slow LCP | Modern formats, sizes, priority |
| Layout thrashing | Jank | Batch DOM reads then writes |
| Blocking main thread | Poor INP | Chunk work, workers if needed |
| Memory leaks (listeners/sockets) | Degradation | Cleanup in effects; close sockets |
| Over-fetching on mount | Slow UX | React Query keys, selective fields |
| Unbounded lists | Memory / jank | Pagination or virtualization |
