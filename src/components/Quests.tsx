import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { quests } from '../data';
import { sfx } from '../lib/sfx';
import { scrollToTarget } from '../lib/scroll';
import { PixelIcon, Sprite } from './Pixel';

export function Quests() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [frame, setFrame] = useState(0);
  const [flip, setFlip] = useState(false);
  const [side, setSide] = useState(false);
  const activeRef = useRef(-1);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      setSide(true);
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
      let lastStep = 0;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const now = performance.now();
            if (now - lastStep > 110 && Math.abs(self.getVelocity()) > 20) {
              lastStep = now;
              setFrame((f) => f + 1);
            }
            setFlip(self.direction < 0);
          },
        },
      });
      // parallax scenery at fractions of the camera speed
      const far = gsap.to('.q-far', {
        x: () => -distance() * 0.18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.6, invalidateOnRefresh: true },
      });
      const mid = gsap.to('.q-mid', {
        x: () => -distance() * 0.42,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.6, invalidateOnRefresh: true },
      });

      // a quest unlocks when the player walks past its "?" block
      const tick = () => {
        const heroX = window.innerWidth * 0.22;
        const blocks = el.querySelectorAll<HTMLElement>('.q-block');
        let idx = -1;
        blocks.forEach((b, i) => {
          if (b.getBoundingClientRect().left < heroX) idx = i;
        });
        if (idx !== activeRef.current) {
          if (idx > activeRef.current) sfx.coin();
          activeRef.current = idx;
          setActive(idx);
        }
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        tween.scrollTrigger?.kill();
        far.scrollTrigger?.kill();
        mid.scrollTrigger?.kill();
        setSide(false);
        setActive(-1);
        activeRef.current = -1;
      };
    });
    // stacked layout: cards simply rise in
    mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
      gsap.utils.toArray<HTMLElement>('.quest').forEach((c) =>
        gsap.from(c, { y: 30, autoAlpha: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 88%' } }),
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="quests" className="quests band-dark" ref={root}>
      <div className="q-sky" aria-hidden="true">
        <div className="q-far" />
        <div className="q-mid" />
      </div>

      <header className="wrap sec-head q-head">
        <p className="eyebrow">
          Quest log <span className="xxx">× × ×</span> Experience
        </p>
        <h2 className="sec-title">Work &amp; training</h2>
        <p className="q-hint">Keep scrolling — the player walks through time →</p>
      </header>

      <div className="q-stage">
        <div className="quest-track" ref={track}>
          {quests.map((q, i) => (
            <article key={q.title + q.org} className={`quest ${i <= active || !side ? 'on' : ''} ${q.now ? 'now' : ''}`}>
              <span className={`q-block ${i <= active || !side ? 'hit' : ''}`} aria-hidden="true">
                {i <= active || !side ? '' : '?'}
                <span className="q-coin">
                  <PixelIcon name="coin" size={18} />
                </span>
              </span>
              <p className="q-when">
                {q.when}
                {q.now && <span className="badge">Now</span>}
              </p>
              <h3>{q.title}</h3>
              <p className="q-org">
                {q.org} <span className="muted">· {q.mode}</span>
              </p>
              <p className="q-body">{q.body}</p>
              {q.tags && (
                <ul className="tags">
                  {q.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
          <article className="quest quest-next">
            <p className="q-when">Next</p>
            <h3>Your quest?</h3>
            <p className="q-body">Got a product to build? Party up.</p>
            <a
              href="#contact"
              className="brace-btn"
              onClick={(e) => {
                e.preventDefault();
                sfx.select();
                scrollToTarget('#contact');
              }}
            >
              {'{'}Start quest{'}'}
            </a>
          </article>
        </div>
        {side && (
          <div className="q-player" aria-hidden="true">
            <Sprite frame={frame} size={56} flip={flip} />
          </div>
        )}
        <div className="q-ground" aria-hidden="true" />
      </div>
    </section>
  );
}
