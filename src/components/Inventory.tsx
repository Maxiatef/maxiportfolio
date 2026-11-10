import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { skillGroups } from '../data';
import { sfx } from '../lib/sfx';
import { PixelEdge, PixelIcon } from './Pixel';

const ALL = { id: 'all', label: 'All items', items: skillGroups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.label }))) };
const SLOTS = 32; // fixed bag size — empty slots make it read as an inventory

export function Inventory() {
  const [tab, setTab] = useState('all');
  const [hover, setHover] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const group = tab === 'all' ? ALL : (() => {
    const g = skillGroups.find((x) => x.id === tab)!;
    return { ...g, items: g.items.map((it) => ({ ...it, group: g.label })) };
  })();
  const focused = group.items.find((i) => i.name === hover);

  return (
    <section id="skills" className="inventory band-lime">
      <PixelEdge color="var(--lime)" seed={23} />
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow ink">
            Inventory <span className="xxx">× × ×</span> Skills
          </p>
          <h2 className="sec-title ink">Equipped tech</h2>
        </header>

        <div className="inv-panel">
          <div className="inv-tabs" role="tablist" aria-label="Skill categories">
            {[{ id: 'all', label: 'All' }, ...skillGroups].map((g) => (
              <button
                key={g.id}
                role="tab"
                aria-selected={tab === g.id}
                className="inv-tab"
                onClick={() => {
                  setTab(g.id);
                  sfx.select();
                }}
                onMouseEnter={sfx.blip}
              >
                {tab === g.id && (
                  <motion.span layoutId="inv-tab-bg" className="inv-tab-bg" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
                )}
                <span className="inv-tab-label">{g.label}</span>
              </button>
            ))}
          </div>

          <div className="inv-body">
            <motion.ul className="inv-grid" role="tabpanel" aria-label={group.label} layout={!reduce}>
              <AnimatePresence mode="popLayout" initial={false}>
                {group.items.map((it, i) => (
                  <motion.li
                    key={it.name}
                    layout={!reduce}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { delay: reduce ? 0 : i * 0.015, type: 'spring', stiffness: 600, damping: 28 } }}
                    exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
                    whileHover={reduce ? undefined : { y: -4 }}
                    className={`slot ${hover === it.name ? 'is-hover' : ''}`}
                    tabIndex={0}
                    onMouseEnter={() => {
                      setHover(it.name);
                      sfx.blip();
                    }}
                    onFocus={() => setHover(it.name)}
                    onMouseLeave={() => setHover(null)}
                    onBlur={() => setHover(null)}
                    aria-label={`${it.name} — ${it.group}`}
                  >
                    <span className="slot-tag">{it.tag}</span>
                    <span className="slot-name">{it.name}</span>
                  </motion.li>
                ))}
                {Array.from({ length: Math.max(0, SLOTS - group.items.length) }, (_, i) => (
                  <motion.li key={`empty-${i}`} layout={!reduce} className="slot empty" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                ))}
              </AnimatePresence>
            </motion.ul>

            <aside className="inv-info" aria-live="polite">
              <p className="tile-kicker">
                <PixelIcon name="chest" size={14} /> Item info
              </p>
              {focused ? (
                <>
                  <p className="inv-big">{focused.tag}</p>
                  <h3>{focused.name}</h3>
                  <p className="muted">Type: {focused.group}</p>
                  <p className="inv-status">
                    <PixelIcon name="star" size={12} /> Equipped
                  </p>
                </>
              ) : (
                <>
                  <p className="inv-big dim">??</p>
                  <h3>Hover an item</h3>
                  <p className="muted">
                    {group.items.length} items in “{group.label}”. Hover or focus a slot to inspect it.
                  </p>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
