# Memento: Personal Timeline

A Next.js + Tailwind app to visualize biological and sociological milestones across a life timeline.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Deploying to Vercel

- Push this repo to GitHub
- Import into Vercel and select the Next.js framework
- Default build command: `next build`
- Output is handled automatically by Vercel

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

- `app/` App Router pages and layout
- `components/` UI and timeline components
- `lib/` Utilities and timeline logic

## Notes

- UI primitives are minimal and self-contained for this prototype (no external UI lib)
- Timeline events are currently hardcoded in `lib/timeline/schema.ts`

## Timeline interactions

### Desktop
- Hover for details: Labels are hidden by default; hover markers or bands to see a tooltip.
- Zoom: Use mouse wheel/trackpad to zoom in/out centered on the cursor.
- Pan: Click-drag horizontally to pan.

### Mobile
- Tap for details: Tap markers or bands to see a tooltip (tap elsewhere to dismiss).
- Zoom: Use pinch gestures to zoom in/out, or tap the zoom buttons in the top-right corner.
- Pan: Drag horizontally with one finger to pan across the timeline.
- Today anchor: The dashed "Today" line has a subtle pulse for orientation.
- Filters: Use the toggles above the canvas to show/hide Biological or Sociological layers.
- Importance: Events can have `importance` 1–3; higher importance appears larger/stronger.
