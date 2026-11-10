import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';
import { scrollToTarget } from '../lib/scroll';
import { sfx } from '../lib/sfx';
import { profile } from '../data';
import { PixelGlobe } from './PixelGlobe';
import { PixelIcon } from './Pixel';

// deterministic star field as box-shadows: one element per parallax layer
function starShadows(count: number, seed: number, color: string) {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: count }, () => `${Math.round(r() * 2000)}px ${Math.round(r() * 1400)}px ${color}`).join(',');
}
const STARS = [
  { cls: 'stars s1', shadow: starShadows(90, 11, '#3a3a3a') },
  { cls: 'stars s2', shadow: starShadows(50, 29, '#7a7a7a') },
  { cls: 'stars s3', shadow: starShadows(22, 47, '#e9f7d4') },
];

export function Hero({ started }: { started: boolean }) {
  const root = useRef<HTMLElement>(null);
  const label = useRef<HTMLDivElement>(null);

  // intro: letters drop in like falling blocks
  useLayoutEffect(() => {
    if (!started) return;
    const ctx = gsap.context(() => {
      const q = reducedMotion() ? 0.01 : 1;
      const tl = gsap.timeline({ defaults: { ease: 'steps(6)' } });
      tl.fromTo('.globe-wrap', { yPercent: 25, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.2 * q, ease: 'power3.out' }, 0)
        .fromTo('.hero-char', { yPercent: -160, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5 * q, stagger: 0.07 * q }, 0.15)
        .fromTo('.hero-sub > *, .hero-inner .eyebrow', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 * q, stagger: 0.08 * q, ease: 'power2.out' }, '-=0.2')
        .fromTo('.hero-stair span', { x: 12, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3 * q, stagger: 0.1 * q, ease: 'steps(4)' }, '<')
        .fromTo('.scroll-cue', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, '-=0.1');
    }, root);
    return () => ctx.revert();
  }, [started]);

  // scroll parallax: stars at three depths, globe rises slower than the page, title lifts away
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.s1', { yPercent: -8, ease: 'none', scrollTrigger: st });
      gsap.to('.s2', { yPercent: -22, ease: 'none', scrollTrigger: st });
      gsap.to('.s3', { yPercent: -40, ease: 'none', scrollTrigger: st });
      gsap.to('.globe-box', { yPercent: -16, scale: 1.08, ease: 'none', scrollTrigger: st });
      gsap.to('.hero-title', { yPercent: -60, ease: 'none', scrollTrigger: st });
      gsap.to('.hero-title .hero-char', {
        y: (i) => (i % 2 ? -1 : 1) * 40,
        ease: 'none',
        scrollTrigger: st,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" className="hero" ref={root} data-live={started}>
      {STARS.map((s) => (
        <div key={s.cls} className={s.cls} style={{ boxShadow: s.shadow }} aria-hidden="true" />
      ))}

      <p className="hero-stair" aria-label="If you're building something that ships, I'm your player 2.">
        <span>IF YOU'RE BUILDING</span>
        <span>SOMETHING THAT SHIPS,</span>
        <span>I'M YOUR PLAYER 2!</span>
      </p>

      <div className="hero-inner">
        <p className="eyebrow">
          Player 1 <span className="xxx">× × ×</span> {profile.base}
        </p>
        <h1 className="hero-title" aria-label={profile.full}>
          {profile.first.split('').map((c, i) => (
            <span className="hero-char" key={i} aria-hidden="true">
              {c}
            </span>
          ))}
          <span className="hero-char hero-slash" aria-hidden="true">
            /
          </span>
        </h1>
        <div className="hero-sub">
          <p>
            Atef Shafiq — <strong>{profile.role}</strong>
            <br />
            .NET · MERN · TypeScript · React Native · AI integrations
          </p>
          <div className="hero-ctas">
            <a
              href="#stages"
              className="brace-btn"
              onMouseEnter={sfx.blip}
              onClick={(e) => {
                e.preventDefault();
                sfx.select();
                scrollToTarget('#stages');
              }}
            >
              {'{'}See projects{'}'}
            </a>
            <a
              href="#contact"
              className="brace-btn ghost"
              onMouseEnter={sfx.blip}
              onClick={(e) => {
                e.preventDefault();
                sfx.select();
                scrollToTarget('#contact');
              }}
            >
              {'{'}Hire me{'}'}
            </a>
          </div>
        </div>
      </div>

      <div className="globe-wrap" aria-hidden="false">
        <div className="globe-box">
          <PixelGlobe
            className="globe"
            onAlexandria={({ x, y, visible }) => {
              const el = label.current;
              if (!el) return;
              el.style.left = `${x * 100}%`;
              el.style.top = `${y * 100}%`;
              el.dataset.visible = String(visible);
              // flip the tag to the marker's left when it would run off-screen
              const box = el.parentElement!.getBoundingClientRect();
              el.dataset.side = box.left + x * box.width + el.offsetWidth + 40 > window.innerWidth ? 'left' : 'right';
            }}
          />
          <div className="globe-label" ref={label} aria-hidden="true">
            <span>Alexandria, EG</span>
            <small>Maximous is here</small>
          </div>
        </div>
      </div>

      <button className="scroll-cue" onClick={() => scrollToTarget('#about')} aria-label="Scroll to the player profile">
        Scroll to play <PixelIcon name="arrow" size={12} className="bob" />
      </button>
    </section>
  );
}
