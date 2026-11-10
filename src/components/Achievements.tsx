import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';
import { achievements } from '../data';
import { PixelIcon } from './Pixel';

export function Achievements() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = reducedMotion();
      gsap.utils.toArray<HTMLElement>('.ach').forEach((el, i) => {
        gsap.from(el, {
          x: q ? 0 : i % 2 ? 60 : -60,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'steps(5)',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });
      // scramble the titles in like an old terminal
      if (!q)
        gsap.utils.toArray<HTMLElement>('.ach-title').forEach((el) => {
          gsap.to(el, {
            duration: 0.9,
            scrambleText: { text: el.dataset.text ?? '', chars: '█▓▒░<>/\\#', speed: 0.6 },
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="achievements" className="achievements band-dark" ref={root}>
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow">
            Achievements <span className="xxx">× × ×</span> Courses
          </p>
          <h2 className="sec-title">Unlocked</h2>
        </header>
        <ul className="ach-list">
          {achievements.map((a) => {
            const inner = (
              <>
                <span className="ach-icon">
                  <PixelIcon name="trophy" size={22} />
                </span>
                <span className="ach-text">
                  <span className="ach-kicker">Achievement unlocked · {a.when}</span>
                  <span className="ach-title" data-text={a.title}>
                    {a.title}
                  </span>
                  <span className="ach-by">{a.by}</span>
                </span>
                {a.link ? (
                  <span className="ach-cta">
                    View certificate <PixelIcon name="play" size={10} />
                  </span>
                ) : (
                  <span className="ach-cta dim">Completed</span>
                )}
              </>
            );
            return (
              <li key={a.title}>
                {a.link ? (
                  <a className="ach" href={a.link} target="_blank" rel="noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className="ach">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
