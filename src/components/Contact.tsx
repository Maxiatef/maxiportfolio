import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { profile, socials } from '../data';
import { sfx } from '../lib/sfx';
import { PixelEdge, PixelIcon } from './Pixel';

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(9);

  // arcade "CONTINUE?" countdown — loops while the section is on screen
  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setCount((c) => (c === 0 ? 9 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [inView, reduce]);

  return (
    <section id="contact" className="contact band-lime" ref={ref}>
      <PixelEdge color="var(--lime)" seed={41} />
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow ink">
            Contact <span className="xxx">× × ×</span> Insert coin
          </p>
          <h2 className="contact-title">
            Continue?
            <motion.span
              key={count}
              className="count"
              initial={reduce ? false : { scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ease: 'easeOut', duration: 0.25 }}
              aria-hidden="true"
            >
              {reduce ? '' : count}
            </motion.span>
          </h2>
          <p className="contact-lead">
            Open to full-time roles, freelance builds and interesting collaborations. Tell me what you're making and I'll reply fast.
          </p>
          <a className="coin-btn" href={`mailto:${profile.email}`} onMouseEnter={sfx.blip} onClick={sfx.powerUp}>
            <PixelIcon name="coin" size={22} />
            <span>
              <small>Press start</small>
              {profile.email}
            </span>
          </a>
        </div>

        <div className="contact-side">
          <ul className="social-grid">
            {socials.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: reduce ? 0 : i * 0.06, ease: 'easeOut' }}
              >
                <a
                  href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="social"
                  onMouseEnter={sfx.blip}
                  onClick={sfx.coin}
                >
                  <span className="social-tag">{s.tag}</span>
                  <span className="social-label">{s.label}</span>
                  <PixelIcon name="play" size={10} className="social-arrow" />
                </a>
              </motion.li>
            ))}
          </ul>
          <a className="cv-btn" href={profile.cv} download onMouseEnter={sfx.blip} onClick={sfx.coin}>
            <PixelIcon name="down" size={16} style={{ transform: 'rotate(90deg)' }} />
            Download CV (PDF)
          </a>
          <p className="contact-phone">
            <PixelIcon name="pin" size={12} /> {profile.base} · <a href={`tel:${profile.phone}`}>{profile.phone}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
