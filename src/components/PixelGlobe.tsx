import { useEffect, useRef, useState } from 'react';
import { geoEquirectangular, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryObject } from 'topojson-specification';
import landTopo from 'world-atlas/land-110m.json';
import { scrollState } from '../lib/scroll';
import { reducedMotion } from '../lib/gsap';

/*
 * A real Earth rendered as pixel art. Coastlines come from Natural Earth (world-atlas),
 * rasterised once into a land mask; every frame each of the N×N pixels is projected onto
 * the sphere, coloured by terrain, cloud and light, then quantised with a Bayer matrix.
 */

const N = 150; // pixel resolution of the globe
const MW = 720; // land-mask texture size (equirectangular)
const MH = 360;
const TILT = (4 * Math.PI) / 180; // near-equatorial camera keeps Egypt high on the visible half
const ALEX = { lat: 31.2, lon: 29.92 };
const FPS = 14; // stepped animation reads as retro

type RGB = [number, number, number];
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
// [lit, shade] pairs
const PAL = {
  deep: [hex('#2b63a8'), hex('#1a3c6e')],
  ocean: [hex('#3a86c8'), hex('#244f86')],
  shallow: [hex('#5cc6d8'), hex('#2f7f9e')],
  grass: [hex('#5fae3e'), hex('#3a7429')],
  forest: [hex('#3f8a2f'), hex('#285a20')],
  sand: [hex('#e6d39c'), hex('#a8935e')],
  rock: [hex('#9a8f6a'), hex('#625b43')],
  ice: [hex('#eef5f4'), hex('#aec4cb')],
  cloud: [hex('#f7f4e9'), hex('#bdbab0')],
} as const;
const RIM = hex('#f1e4b4');
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

// ---------- noise (3D value noise so clouds have no seam) ----------
function hash(x: number, y: number, z: number) {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  return l(
    l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
    l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v),
    w,
  );
}
function fbm(x: number, y: number, z: number) {
  return vnoise(x, y, z) * 0.55 + vnoise(x * 2.1, y * 2.1, z * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3, z * 4.3) * 0.15;
}

// ---------- one-time precompute ----------
type Textures = { land: Uint8Array; coast: Uint8Array; tone: Float32Array };
let cachedTextures: Textures | null = null;

function buildTextures(): Textures {
  if (cachedTextures) return cachedTextures;
  const c = document.createElement('canvas');
  c.width = MW;
  c.height = MH;
  const g = c.getContext('2d', { willReadFrequently: true })!;
  const topo = landTopo as unknown as Topology;
  const land = feature(topo, topo.objects.land as GeometryObject);
  const proj = geoEquirectangular().scale(MW / (2 * Math.PI)).translate([MW / 2, MH / 2]);
  g.fillStyle = '#fff';
  g.beginPath();
  geoPath(proj, g)(land);
  g.fill();
  const px = g.getImageData(0, 0, MW, MH).data;
  const landMask = new Uint8Array(MW * MH);
  for (let i = 0; i < MW * MH; i++) landMask[i] = px[i * 4 + 3] > 110 ? 1 : 0;

  // coast proximity → shallow water ring
  const coast = new Uint8Array(MW * MH);
  const R = 5;
  for (let y = 0; y < MH; y++)
    for (let x = 0; x < MW; x++) {
      if (landMask[y * MW + x]) continue;
      let near = 0;
      for (let dy = -R; dy <= R && !near; dy += 1)
        for (let dx = -R; dx <= R; dx += 1) {
          const yy = y + dy;
          if (yy < 0 || yy >= MH) continue;
          const xx = (x + dx + MW) % MW;
          if (landMask[yy * MW + xx]) {
            near = dx * dx + dy * dy <= 9 ? 2 : 1;
            if (near === 2) break;
          }
        }
      coast[y * MW + x] = near;
    }

  // terrain tone noise for forest/grass variation (stable per texel)
  const tone = new Float32Array(MW * MH);
  for (let y = 0; y < MH; y++)
    for (let x = 0; x < MW; x++) {
      const lon = (x / MW) * Math.PI * 2;
      const lat = (0.5 - y / MH) * Math.PI;
      const cx = Math.cos(lat) * Math.sin(lon), cy = Math.sin(lat), cz = Math.cos(lat) * Math.cos(lon);
      tone[y * MW + x] = fbm(cx * 6 + 11, cy * 6 + 3, cz * 6 + 7);
    }
  cachedTextures = { land: landMask, coast, tone };
  return cachedTextures;
}

function terrain(t: Textures, idx: number, latDeg: number, lonDeg: number) {
  if (!t.land[idx]) return t.coast[idx] === 2 ? PAL.shallow : t.coast[idx] === 1 ? PAL.ocean : PAL.deep;
  const a = Math.abs(latDeg);
  if (a > 64 || latDeg < -58) return PAL.ice;
  const tone = t.tone[idx];
  // deserts: Sahara & Arabia, Australian interior, US south-west, Atacama/Patagonia band
  const sahara = latDeg > 14 && latDeg < 34 && lonDeg > -17 && lonDeg < 60;
  const aus = latDeg > -32 && latDeg < -18 && lonDeg > 118 && lonDeg < 142;
  const gobi = latDeg > 36 && latDeg < 48 && lonDeg > 75 && lonDeg < 115;
  const usa = latDeg > 28 && latDeg < 40 && lonDeg > -118 && lonDeg < -104;
  if (sahara || aus || gobi || usa) return tone > 0.62 ? PAL.rock : PAL.sand;
  if (a > 50 && tone > 0.55) return PAL.rock;
  return tone > 0.5 ? PAL.forest : PAL.grass;
}

export function PixelGlobe({ className, onAlexandria }: { className?: string; onAlexandria?: (p: { x: number; y: number; visible: boolean }) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const cb = useRef(onAlexandria);
  cb.current = onAlexandria;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(N, N);
    const data = img.data;
    let tex: Textures | null = null;
    let raf = 0;
    let visible = true;
    let last = 0;
    // start with Alexandria facing the camera, slightly right of centre
    let rot = -ALEX.lon - 18;
    let cloudRot = 0;
    const still = reducedMotion();

    // per-pixel sphere geometry (independent of rotation)
    const geo: { lat: number; lonBase: number; light: number; rim: boolean }[] = new Array(N * N);
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    const L = [-0.55, 0.5, 0.67]; // light from upper-left, toward viewer
    const ll = Math.hypot(L[0], L[1], L[2]);
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const nx = ((x + 0.5) / N) * 2 - 1;
        const ny = 1 - ((y + 0.5) / N) * 2;
        const r2 = nx * nx + ny * ny;
        const i = y * N + x;
        if (r2 > 1) {
          geo[i] = { lat: 0, lonBase: 0, light: -1, rim: r2 < 1 + 5 / N };
          continue;
        }
        const nz = Math.sqrt(1 - r2);
        // undo camera tilt (rotate around x axis)
        const wy = ny * cosT + nz * sinT;
        const wz = -ny * sinT + nz * cosT;
        const lat = Math.asin(Math.max(-1, Math.min(1, wy)));
        const lonBase = Math.atan2(nx, wz);
        const light = (nx * L[0] + ny * L[1] + nz * L[2]) / ll;
        geo[i] = { lat, lonBase, light, rim: false };
      }

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || !tex) return;
      if (t - last < 1000 / FPS) return;
      const dt = last ? Math.min(0.2, (t - last) / 1000) : 0;
      last = t;
      const boost = Math.min(60, Math.abs(scrollState.velocity) * 1.6);
      if (!still) {
        rot += dt * (5 + boost);
        cloudRot += dt * (8 + boost * 1.4);
      }
      paint();
    };

    const paint = () => {
      const T = tex!;
      const rotR = (rot * Math.PI) / 180;
      const cloudR = (cloudRot * Math.PI) / 180;
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          const o = i * 4;
          const gp = geo[i];
          if (gp.light === -1) {
            if (gp.rim) {
              data[o] = RIM[0]; data[o + 1] = RIM[1]; data[o + 2] = RIM[2]; data[o + 3] = 255;
            } else data[o + 3] = 0;
            continue;
          }
          let lon = gp.lonBase - rotR;
          lon = ((lon + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
          const latDeg = (gp.lat * 180) / Math.PI;
          const lonDeg = (lon * 180) / Math.PI;
          const tx = Math.min(MW - 1, Math.floor(((lon + Math.PI) / (2 * Math.PI)) * MW));
          const ty = Math.min(MH - 1, Math.floor((0.5 - gp.lat / Math.PI) * MH));
          let pair: readonly RGB[] = terrain(T, ty * MW + tx, latDeg, lonDeg);

          // clouds drift on their own axis speed
          const cl = gp.lonBase - cloudR;
          const cosLat = Math.cos(gp.lat);
          const n = fbm(cosLat * Math.sin(cl) * 2.6 + 4, Math.sin(gp.lat) * 2.6, cosLat * Math.cos(cl) * 2.6 + 9);
          const b = BAYER[(y & 3) * 4 + (x & 3)];
          if (n > 0.66 + b * 0.06) pair = PAL.cloud;

          // light: dithered terminator between lit and shade
          const lit = gp.light * 0.5 + 0.5;
          const shade = lit < 0.36 + b * 0.22;
          const c = shade ? pair[1] : pair[0];
          // night side gets one extra darkening step
          const night = lit < 0.16 + b * 0.12;
          data[o] = night ? c[0] * 0.55 : c[0];
          data[o + 1] = night ? c[1] * 0.55 : c[1];
          data[o + 2] = night ? c[2] * 0.62 : c[2];
          data[o + 3] = 255;
        }

      // Alexandria — blinking 2×2 lime marker + projected position for the DOM label
      const aLat = (ALEX.lat * Math.PI) / 180;
      const aLon = (ALEX.lon * Math.PI) / 180 + rotR;
      const wx = Math.cos(aLat) * Math.sin(aLon);
      const wy = Math.sin(aLat);
      const wz = Math.cos(aLat) * Math.cos(aLon);
      // apply camera tilt
      const vy = wy * cosT - wz * sinT;
      const vz = wy * sinT + wz * cosT;
      const sx = ((wx + 1) / 2) * N;
      const sy = ((1 - vy) / 2) * N;
      const front = vz > 0.18;
      if (front && Math.floor(performance.now() / 420) % 2 === 0) {
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const px = Math.floor(sx) + dx, py = Math.floor(sy) + dy;
            if (px < 0 || py < 0 || px >= N || py >= N) continue;
            const o = (py * N + px) * 4;
            const edge = dx !== 0 && dy !== 0;
            data[o] = edge ? 11 : 182; data[o + 1] = edge ? 11 : 243; data[o + 2] = edge ? 11 : 107;
          }
      }
      ctx.putImageData(img, 0, 0);
      cb.current?.({ x: sx / N, y: sy / N, visible: front });
    };

    // build textures off the critical path
    const idle = (fn: () => void) =>
      'requestIdleCallback' in window ? (window as Window).requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 30);
    idle(() => {
      tex = buildTextures();
      paint();
      setReady(true);
    });
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' });
    io.observe(canvas);
    const onVis = () => (visible = !document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={N}
      height={N}
      className={className}
      data-ready={ready}
      role="img"
      aria-label="Pixel-art Earth rotating, with Alexandria, Egypt marked"
    />
  );
}
