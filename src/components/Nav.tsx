import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { scrollToTarget, lockScroll } from '../lib/scroll';
import { sfx } from '../lib/sfx';
import { PixelIcon } from './Pixel';

const LINKS = [
  { href: '#about', label: 'Player' },
  { href: '#education', label: 'Edu' },
  { href: '#quests', label: 'Quests' },
  { href: '#skills', label: 'Inventory' },
  { href: '#stages', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

function useScore() {
  const [score, setScore] = useState(0);
  const [hi, setHi] = useState(() => {
    try {
      return Number(localStorage.getItem('mx-hi') ?? 0);
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const s = Math.round((window.scrollY / Math.max(1, max)) * 9999) * 10;
      setScore(s);
      setHi((h) => {
        if (s <= h) return h;
        try {
          localStorage.setItem('mx-hi', String(s));
        } catch {
          /* storage unavailable — keep it in memory */
        }
        return s;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return { score, hi };
}

export function Nav({ crt, onCrt }: { crt: boolean; onCrt: () => void }) {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(sfx.on);
  const { score, hi } = useScore();

  useEffect(() => sfx.subscribe(setSound), []);
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    sfx.select();
    setOpen(false);
    // wait one frame so the menu unlock doesn't fight the scroll
    requestAnimationFrame(() => scrollToTarget(href));
  };

  return (
    <>
      <header className="nav">
        <div className="nav-rule" />
        <div className="nav-row">
          <a href="#top" className="nav-logo" onClick={go('#top')} onMouseEnter={sfx.blip}>
            MAXIMOUS <span className="xxx">× × ×</span>
          </a>
          <nav className="nav-links" aria-label="Sections">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={go(l.href)} onMouseEnter={sfx.blip}>
                {l.label}
              </a>
            ))}
          </nav>
          <div className="nav-hud">
            <span className="hud-score" aria-label={`Score ${score}, high score ${hi}`}>
              <b>1UP</b> {String(score).padStart(6, '0')} <b className="dim">HI</b> {String(hi).padStart(6, '0')}
            </span>
            <button className="hud-btn" onClick={onCrt} aria-pressed={crt} title="Toggle CRT scanlines">
              CRT {crt ? 'ON' : 'OFF'}
            </button>
            <button className="hud-btn" onClick={() => sfx.toggle()} aria-pressed={sound} title="Toggle 8-bit sound">
              SFX {sound ? 'ON' : 'OFF'}
            </button>
            <button className="nav-burger" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
              <i />
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
          >
            <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu" autoFocus>
              <PixelIcon name="close" size={22} />
            </button>
            <p className="eyebrow">Select stage</p>
            <ul>
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, ease: 'easeOut' }}
                >
                  <a href={l.href} onClick={go(l.href)}>
                    <PixelIcon name="play" size={18} className="menu-caret" />
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="menu-hud">
              <button className="hud-btn" onClick={onCrt} aria-pressed={crt}>
                CRT {crt ? 'ON' : 'OFF'}
              </button>
              <button className="hud-btn" onClick={() => sfx.toggle()} aria-pressed={sound}>
                SFX {sound ? 'ON' : 'OFF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
