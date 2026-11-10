import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';
import { scrollToTarget } from '../lib/scroll';
import { PixelEdge, PixelIcon } from './Pixel';

const WORDS = ['Full stack developer', '.NET', 'MERN', 'TypeScript', 'React Native', 'AI agents', 'Alexandria, EG'];

/** Infinite ticker whose speed and direction follow the scroll. */
export function Marquee({ tone = 'lime' }: { tone?: 'lime' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current!;
    const loop = gsap.to(el.querySelectorAll('.marquee-row'), { xPercent: -100, repeat: -1, duration: 28, ease: 'none' });
    let dir = 1;
    const st = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity() / 300;
          if (self.direction !== dir) dir = self.direction;
          gsap.to(loop, { timeScale: dir * Math.max(1, Math.min(6, Math.abs(v))), duration: 0.2, overwrite: true });
        },
      },
    });
    return () => {
      loop.kill();
      st.scrollTrigger?.kill();
      st.kill();
    };
  }, []);
  const row = (
    <div className="marquee-row" aria-hidden="true">
      {WORDS.map((w) => (
        <span key={w}>
          {w} <PixelIcon name="star" size={14} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${tone}`} ref={ref} role="presentation">
      {row}
      {row}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer band-dark">
      <PixelEdge color="var(--ink)" seed={53} />
      <Marquee tone="dark" />
      <div className="wrap footer-row">
        <p>
          © {new Date().getFullYear()} Maximous Atef Shafiq. Built with React, GSAP &amp; Framer Motion — every pixel placed by hand.
        </p>
        <p className="footer-hint">
          Psst: try <kbd>↑</kbd>
          <kbd>↑</kbd>
          <kbd>↓</kbd>
          <kbd>↓</kbd>
          <kbd>←</kbd>
          <kbd>→</kbd>
          <kbd>←</kbd>
          <kbd>→</kbd>
          <kbd>B</kbd>
          <kbd>A</kbd>
        </p>
        <button className="to-top" onClick={() => scrollToTarget(0)}>
          <PixelIcon name="arrow" size={12} style={{ transform: 'rotate(180deg)' }} /> Back to start
        </button>
      </div>
    </footer>
  );
}
