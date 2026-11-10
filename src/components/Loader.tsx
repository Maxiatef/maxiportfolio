import { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';

const LINES = ['MAXIMOUS.EXE  v2026', 'LOADING WORLD MAP .......... OK', 'SPAWNING PLAYER 1 .......... OK', 'ALEXANDRIA, EG .............. OK'];
const COLS = 14;
const ROWS = 9;

export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const quick = reducedMotion();
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(counter, {
      v: 100,
      duration: quick ? 0.2 : 1.5,
      ease: 'steps(20)',
      onUpdate: () => {
        const v = Math.round(counter.v);
        setPct(v);
        setLines(Math.min(LINES.length, Math.floor(v / 25) + 1));
      },
    });
    tl.to('.loader-text', { autoAlpha: 0, duration: 0.15 }, '+=0.2');
    // dissolve: each tile drops out in a random order
    tl.to('.loader-cell', {
      scale: 0,
      duration: quick ? 0.01 : 0.28,
      ease: 'steps(3)',
      stagger: { each: quick ? 0 : 0.006, from: 'random' },
    });
    return () => {
      tl.kill();
    };
  }, [onDone]);

  const blocks = 20;
  const filled = Math.round((pct / 100) * blocks);

  return (
    <div className="loader" ref={root} role="status" aria-live="polite" aria-label={`Loading ${pct}%`}>
      <div className="loader-grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <span className="loader-cell" key={i} />
        ))}
      </div>
      <div className="loader-text">
        {LINES.slice(0, lines).map((l) => (
          <p key={l}>{l}</p>
        ))}
        <div className="loader-bar" aria-hidden="true">
          {Array.from({ length: blocks }, (_, i) => (
            <i key={i} className={i < filled ? 'on' : ''} />
          ))}
        </div>
        <p className="loader-pct">
          {String(pct).padStart(3, '0')}%<span className="blink">_</span>
        </p>
      </div>
    </div>
  );
}
