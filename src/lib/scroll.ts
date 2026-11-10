import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from './gsap';

let lenis: Lenis | null = null;
// shared scroll velocity — the globe spins faster while you scroll
export const scrollState = { velocity: 0 };

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return () => {};
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity;
    ScrollTrigger.update();
  });
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, offset: 0 });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
