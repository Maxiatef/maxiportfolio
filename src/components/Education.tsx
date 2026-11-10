import { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';
import { PixelEdge, PixelIcon, Sprite } from './Pixel';

const NODES = [
  { id: 'Y1', label: 'Oct 2020', note: 'Enrolled' },
  { id: 'Y2', label: '2021', note: 'Year 2' },
  { id: 'Y3', label: '2022', note: 'Year 3' },
  { id: 'Y4', label: '2023', note: 'Year 4' },
  { id: 'GRAD', label: 'Jun 2024', note: 'Graduated' },
];

export function Education() {
  const root = useRef<HTMLElement>(null);
  const [reached, setReached] = useState(0);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reducedMotion()) {
        setReached(NODES.length - 1);
        return;
      }
      const walker = { p: 0 };
      let lastFrameAt = 0;
      gsap.to(walker, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.edu-map',
          start: 'top 80%',
          end: 'bottom 35%',
          scrub: 0.4,
        },
        onUpdate: () => {
          const track = root.current?.querySelector<HTMLElement>('.edu-walker');
          if (!track) return;
          track.style.left = `${walker.p * 100}%`;
          setReached(Math.round(walker.p * (NODES.length - 1)));
          const now = performance.now();
          if (now - lastFrameAt > 120) {
            lastFrameAt = now;
            setFrame((f) => f + 1);
          }
        },
      });
      gsap.from('.edu-card > *', {
        y: 24,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.edu-card', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="education" className="edu band-dark" ref={root}>
      <PixelEdge color="var(--ink)" seed={13} />
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow">
            World 1 <span className="xxx">× × ×</span> Education
          </p>
          <h2 className="sec-title">Alexandria University</h2>
        </header>

        <div className="edu-map" role="list" aria-label="University timeline">
          <div className="edu-track">
            <div className="edu-path" aria-hidden="true" />
            <div className="edu-path-fill" aria-hidden="true" style={{ width: `${(reached / (NODES.length - 1)) * 100}%` }} />
            {NODES.map((n, i) => (
              <div
                key={n.id}
                role="listitem"
                className={`edu-node ${i <= reached ? 'on' : ''} ${i === NODES.length - 1 ? 'goal' : ''}`}
                style={{ left: `${(i / (NODES.length - 1)) * 100}%` }}
              >
                <span className="edu-dot">{i === NODES.length - 1 ? <PixelIcon name="cap" size={22} /> : n.id}</span>
                <span className="edu-label">
                  <b>{n.label}</b>
                  {n.note}
                </span>
              </div>
            ))}
            <div className="edu-walker" aria-hidden="true">
              <Sprite frame={reached === NODES.length - 1 ? 0 : frame} size={34} />
            </div>
          </div>
        </div>

        <article className="edu-card">
          <div className="edu-card-main">
            <p className="tile-kicker">
              <PixelIcon name="cap" size={14} /> Faculty of Science · Oct 2020 — Jun 2024
            </p>
            <h3>Software Industry &amp; Multimedia Department</h3>
            <p className="muted">
              Bachelor’s studies at Alexandria University, graduating with a <strong className="lime">3.5 / 4.0 (Excellent)</strong>.
            </p>
          </div>
          <div className="edu-bosses">
            <p className="tile-kicker">
              <PixelIcon name="sword" size={14} /> Boss fights
            </p>
            <a href="https://github.com/mennamoussa/petpal" target="_blank" rel="noreferrer" className="boss">
              <span>
                <b>Petpal</b> — graduation project
              </span>
              <em>Grade: Excellent</em>
            </a>
            <a href="https://github.com/Andrewaziz99/E-Commerce_Web_Application" target="_blank" rel="noreferrer" className="boss">
              <span>
                <b>E-Commerce Gaming</b> — microservices
              </span>
              <em>Docker · Redis</em>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
