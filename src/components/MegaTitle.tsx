import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';

/** Oversized pixel headline that bleeds off the edge and slides sideways with the scroll. */
export function MegaTitle({ text, label, dir = 1, as: Tag = 'h2' }: { text: string; label?: string; dir?: 1 | -1; as?: 'h2' | 'p' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current!;
    const inner = el.firstElementChild as HTMLElement;
    const tween = gsap.fromTo(
      inner,
      { xPercent: dir > 0 ? 4 : -22 },
      {
        xPercent: dir > 0 ? -22 : 4,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [dir]);
  return (
    <div className="mega" ref={ref}>
      <Tag className="mega-text" aria-label={label}>
        {text}
      </Tag>
    </div>
  );
}
