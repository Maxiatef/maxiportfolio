import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { stageFilters, stages, type Stage } from '../data';
import { sfx } from '../lib/sfx';
import { lockScroll } from '../lib/scroll';
import { MegaTitle } from './MegaTitle';
import { PixelEdge, PixelIcon } from './Pixel';

/** Screenshot drawn at ~1/20 resolution; the sharp image fades in on hover. */
function PixelThumb({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const c = ref.current;
      if (!c) return;
      const w = 48;
      const h = Math.round((w * 10) / 16);
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d')!;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let sw = img.naturalWidth, sh = img.naturalHeight, sx = 0, sy = 0;
      if (ir > cr) {
        sw = sh * cr;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = sw / cr;
        sy = 0;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    };
  }, [src]);
  return (
    <div className="thumb">
      <canvas ref={ref} aria-hidden="true" />
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

/** Projects without a screenshot get a generated title card. */
function TitleCard({ title }: { title: string }) {
  return (
    <div className="thumb thumb-title" aria-hidden="true">
      <span>{title}</span>
    </div>
  );
}

function StageCard({ s, onOpen }: { s: Stage; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 22 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 300, damping: 22 });

  return (
    <motion.li
      layout={!reduce}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`stage ${s.featured ? 'featured' : ''}`}
    >
      <motion.button
        className="stage-btn"
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        onMouseEnter={sfx.blip}
        onClick={() => {
          sfx.select();
          onOpen();
        }}
        aria-haspopup="dialog"
        aria-label={`${s.title} — ${s.kind}. Open details`}
      >
        {s.img ? <PixelThumb src={s.img} alt="" /> : <TitleCard title={s.title} />}
        <span className="stage-meta">
          <span className="tile-kicker">
            <PixelIcon name={s.featured ? 'star' : 'pad'} size={14} /> {s.kind}
          </span>
          <span className="stage-title">{s.title}</span>
          <span className="stage-desc">{s.desc}</span>
          <span className="press">
            Press start <PixelIcon name="play" size={10} />
          </span>
        </span>
      </motion.button>
    </motion.li>
  );
}

function StageModal({ s, onClose }: { s: Stage; onClose: () => void }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div className="modal-veil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        // CRT-style power-on: a thin line that opens vertically
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(49% 0 49% 0)', opacity: 1 }}
        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0 0% 0)', opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { clipPath: 'inset(49% 0 49% 0)', opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.7, 0, 0.2, 1] }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close project details" autoFocus>
          <PixelIcon name="close" size={18} />
        </button>
        {s.img ? <img className="modal-img" src={s.img} alt={`${s.title} screenshot`} /> : <TitleCard title={s.title} />}
        <div className="modal-body">
          <p className="tile-kicker">
            <PixelIcon name="star" size={14} /> {s.kind}
          </p>
          <h3 id="modal-title">{s.title}</h3>
          <p>{s.desc}</p>
          <ul className="tags">
            {s.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <a className="brace-btn" href={s.link} target="_blank" rel="noreferrer" onClick={sfx.coin}>
            {'{'}Open project{'}'}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Stages() {
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState<Stage | null>(null);
  const list = stages.filter((s) => filter === 'all' || s.filter === filter);

  return (
    <section id="stages" className="stages band-dark">
      <PixelEdge color="var(--ink)" seed={31} />
      <MegaTitle text="STAGES/(" label="Projects" dir={-1} />
      <div className="wrap">
        <div className="stages-head">
          <p className="eyebrow">
            Select stage <span className="xxx">× × ×</span> {stages.length} projects
          </p>
          <div className="chips" role="group" aria-label="Filter projects">
            {stageFilters.map((f) => (
              <button
                key={f.id}
                className="chip"
                aria-pressed={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  sfx.select();
                }}
                onMouseEnter={sfx.blip}
              >
                {filter === f.id && <motion.span layoutId="chip-bg" className="chip-bg" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul className="stage-grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((s) => (
              <StageCard key={s.title} s={s} onOpen={() => setOpen(s)} />
            ))}
          </AnimatePresence>
        </motion.ul>

        <p className="more">
          More side quests live on{' '}
          <a href="https://github.com/Maxiatef" target="_blank" rel="noreferrer">
            github.com/Maxiatef
          </a>
        </p>
      </div>

      <AnimatePresence>{open && <StageModal s={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
