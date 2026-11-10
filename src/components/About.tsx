import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';
import { profile, quests, stages } from '../data';
import { sfx } from '../lib/sfx';
import { PixelEdge, PixelIcon } from './Pixel';
import { PixelPortrait } from './PixelPortrait';
import { MegaTitle } from './MegaTitle';

const active = quests.filter((q) => q.now);

export function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = reducedMotion();
      gsap.from('.stat-row', {
        x: q ? 0 : -24,
        autoAlpha: 0,
        duration: 0.4,
        ease: 'steps(4)',
        stagger: 0.07,
        scrollTrigger: { trigger: '.stat-sheet', start: 'top 75%' },
      });
      gsap.from('.gpa-fill i', {
        autoAlpha: 0,
        duration: 0.05,
        stagger: 0.06,
        scrollTrigger: { trigger: '.gpa-fill', start: 'top 85%' },
      });
      gsap.from('.device', {
        y: q ? 0 : 80,
        rotate: q ? 0 : -2,
        ease: 'none',
        scrollTrigger: { trigger: '.device', start: 'top bottom', end: 'top 40%', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about band-lime" ref={root}>
      <PixelEdge color="var(--lime)" />
      <MegaTitle text="PLAYER/(" label="Player profile" />

      <div className="wrap about-meta">
        <p className="eyebrow ink">
          Player profile <span className="xxx">× × ×</span>
        </p>
        <p className="about-summary">{profile.summary}</p>
        <a className="brace-btn ink" href={profile.cv} download onMouseEnter={sfx.blip} onClick={sfx.coin}>
          {'{'}Download CV{'}'}
        </a>
      </div>

      <div className="wrap">
        <div className="device">
          <div className="device-screen">
            <PixelPortrait src="/me.jpeg" alt={`Pixel-art portrait of ${profile.full}`} />
            <div className="stat-sheet">
              <p className="sheet-head">
                <PixelIcon name="heart" size={14} /> <PixelIcon name="heart" size={14} /> <PixelIcon name="heart" size={14} />
                <span>Character sheet</span>
              </p>
              <dl>
                <div className="stat-row">
                  <dt>Name</dt>
                  <dd>{profile.full}</dd>
                </div>
                <div className="stat-row">
                  <dt>Class</dt>
                  <dd>{profile.role}</dd>
                </div>
                <div className="stat-row">
                  <dt>Spawn</dt>
                  <dd>Muharram Beik, {profile.base}</dd>
                </div>
                <div className="stat-row">
                  <dt>Main stacks</dt>
                  <dd>.NET Core · MERN · TypeScript</dd>
                </div>
                <div className="stat-row">
                  <dt>GPA</dt>
                  <dd className="gpa">
                    <span className="gpa-fill" aria-hidden="true">
                      {Array.from({ length: 16 }, (_, i) => (
                        <i key={i} className={i < 14 ? 'on' : ''} />
                      ))}
                    </span>
                    3.5 / 4.0 · Excellent
                  </dd>
                </div>
                <div className="stat-row">
                  <dt>Languages</dt>
                  <dd>Arabic (native) · English (excellent)</dd>
                </div>
                <div className="stat-row">
                  <dt>Projects</dt>
                  <dd>{stages.length} stages cleared</dd>
                </div>
                <div className="stat-row">
                  <dt>Status</dt>
                  <dd>
                    <span className="dot-live" aria-hidden="true" /> {active.length} active quests — {active.map((q) => q.org).join(' & ')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
