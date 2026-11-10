import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/gsap';

const W = 432;
const H = 592;
// Game Boy–style ramp in the site's lime
const RAMP = ['#0b0b0b', '#1e3014', '#4a7229', '#8cc653', '#d9f7b5'].map((h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
]);
const ZOOM = 1.3;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);

/** The photo resolves from chunky blocks to fine pixels as the section scrolls into view. */
export function PixelPortrait({ src, alt }: { src: string; alt: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const small = document.createElement('canvas');
    const sctx = small.getContext('2d', { willReadFrequently: true })!;
    const img = new Image();
    img.src = src;
    let block = 0;
    const state = { block: reducedMotion() ? 3 : 28 };

    const render = () => {
      const b = Math.max(2, Math.round(state.block));
      if (b === block || !img.complete || !img.naturalWidth) return;
      block = b;
      const w = Math.ceil(W / b);
      const h = Math.ceil(H / b);
      small.width = w;
      small.height = h;
      // cover-fit the photo
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = W / H;
      let sw = img.naturalWidth, sh = img.naturalHeight;
      if (ir > cr) sw = sh * cr;
      else sh = sw / cr;
      // zoom in on the face (also trims the corners of the source photo)
      sw /= ZOOM;
      sh /= ZOOM;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = (img.naturalHeight - sh) * 0.3;
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      const d = sctx.getImageData(0, 0, w, h);
      const p = d.data;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const o = (y * w + x) * 4;
          const lum = (p[o] * 0.3 + p[o + 1] * 0.59 + p[o + 2] * 0.11) / 255;
          // keep the backdrop clean black, dither only where there is detail
          const v = lum < 0.07 ? 0 : Math.pow(lum, 0.8) * (RAMP.length - 1) + BAYER[(y & 3) * 4 + (x & 3)] * 0.9;
          const c2 = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(v)))];
          p[o] = c2[0];
          p[o + 1] = c2[1];
          p[o + 2] = c2[2];
        }
      sctx.putImageData(d, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, w, h, 0, 0, w * b, h * b);
    };

    img.onload = () => {
      block = 0;
      render();
    };

    const tween = reducedMotion()
      ? null
      : gsap.to(state, {
          block: 3,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: { trigger: wrap.current, start: 'top 85%', end: 'center 45%', scrub: 0.6 },
        });
    render();
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [src]);

  return (
    <div className="portrait" ref={wrap}>
      <canvas ref={canvas} width={W} height={H} role="img" aria-label={alt} />
      <img src={src} alt="" aria-hidden="true" className="portrait-real" loading="lazy" />
      <span className="portrait-tag">P1</span>
    </div>
  );
}
