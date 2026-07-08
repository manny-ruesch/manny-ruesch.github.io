# Manny Ruesch — portfolio

A single-page portfolio plus six engineering case studies, hand-written in static HTML.
No framework, no build step, no dependencies.

**Live:** __SITE_URL__

## What's here

| Path | |
|---|---|
| `index.html` | Homepage — hero, project cards, stack |
| `work/*.html` | Six case studies, one file each, one URL each |
| `assets/site.css` · `site.js` | Shared nav, footer, animated MR monogram, scroll reveals |
| `assets/case.css` | Case-study layer: architecture diagrams, callouts |
| `assets/og/` | Open Graph preview images |

## Design notes

- **Six real pages, not a JS router.** Each case study has a shareable URL and a working
  link preview. A client-side router would have broken both — LinkedIn does not run
  JavaScript when it builds a preview card.
- **The MR monogram draws itself** on load: a node-graph `M` and `R` inside a chip
  outline, traced by a glowing pen tip that follows an invisible SVG path via
  `getPointAtLength()`.
- **Architecture diagrams are inline SVG** with an animated `stroke-dasharray` flow.
  On narrow screens they scroll horizontally inside their own container; the page body
  never does.
- **`prefers-reduced-motion` is honoured everywhere.** Every animation stops and all
  content is revealed immediately. Getting this right required re-asserting one rule as
  a cascade anchor after splitting the stylesheet — a `.card` transition had started
  winning on source order.

## Confidentiality

The employer is never named. All workflow identifiers, credentials, webhook paths and
internal URLs are excluded. A local grep guard runs before every commit and blocks the
push if any of them appear.

---

Built by **Manny Ruesch** · [LinkedIn](https://www.linkedin.com/in/manny-ruesch)
