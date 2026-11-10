# Maximous Atef Shafiq — 8-bit portfolio

Retro, game-inspired portfolio built with React + TypeScript (Vite), GSAP (ScrollTrigger, ScrambleText), Framer Motion and Lenis smooth scrolling.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Where things live

- `src/data.ts` — all content: profile, socials, experience (quests), skills, projects (stages), courses.
- `src/components/PixelGlobe.tsx` — real Earth (Natural Earth coastlines) rendered as rotating pixel art with an Alexandria marker. Scrolling spins it faster.
- `src/components/Quests.tsx` — pinned side-scroller: the player sprite walks through your experience.
- `src/components/PixelPortrait.tsx` — photo that de-pixelates as you scroll (Game Boy palette).
- `public/` — CV PDF, portrait and project screenshots.

Extras: CRT scanlines toggle, 8-bit SFX toggle (off by default), score HUD, and a Konami code easter egg (↑↑↓↓←→←→BA).
Respects `prefers-reduced-motion`.
