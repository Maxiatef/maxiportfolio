import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sfx } from '../lib/sfx';
import { PixelIcon } from './Pixel';

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

/** ↑↑↓↓←→←→BA — rains coins and flips the site into "power mode" for a few seconds. */
export function Konami() {
  const [on, setOn] = useState(false);
  const [coins] = useState(() =>
    Array.from({ length: 40 }, (_, i) => ({ id: i, x: Math.random() * 100, d: 1.2 + Math.random() * 1.6, delay: Math.random() * 0.8 })),
  );

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === CODE[i] ? i + 1 : k === CODE[0] ? 1 : 0;
      if (i === CODE.length) {
        i = 0;
        setOn(true);
        sfx.powerUp();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('power', on);
    if (!on) return;
    const t = setTimeout(() => setOn(false), 4200);
    return () => clearTimeout(t);
  }, [on]);

  return (
    <AnimatePresence>
      {on && (
        <motion.div className="konami" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="assertive">
          <motion.p className="konami-toast" initial={{ y: -60 }} animate={{ y: 0 }} transition={{ ease: [0.2, 1.6, 0.4, 1] }}>
            Cheat activated · +30 lives
          </motion.p>
          {coins.map((c) => (
            <motion.span
              key={c.id}
              className="konami-coin"
              style={{ left: `${c.x}%` }}
              initial={{ y: '-10vh' }}
              animate={{ y: '110vh' }}
              transition={{ duration: c.d, delay: c.delay, ease: 'easeIn' }}
            >
              <PixelIcon name="coin" size={24} />
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
