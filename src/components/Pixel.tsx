import type { CSSProperties } from 'react';

// Every icon is hand-placed on an 8×8 grid. "X" = filled with currentColor.
const ICONS = {
  heart: ['.XX.XX..', 'XXXXXXX.', 'XXXXXXX.', 'XXXXXXX.', '.XXXXX..', '..XXX...', '...X....', '........'],
  star: ['...X....', '...X....', '..XXX...', 'XXXXXXX.', '.XXXXX..', '..XXX...', '.XX.XX..', '.X...X..'],
  coin: ['..XXXX..', '.XX..XX.', 'XX.XX.XX', 'XX.XX.XX', 'XX.XX.XX', 'XX.XX.XX', '.XX..XX.', '..XXXX..'],
  trophy: ['XXXXXXXX', 'X.XXXX.X', 'X.XXXX.X', '.XXXXXX.', '..XXXX..', '...XX...', '..XXXX..', '.XXXXXX.'],
  cap: ['........', '...XX...', '.XXXXXX.', 'XXXXXXXX', '.XXXXXX.', '..XXXX.X', '..XXXX.X', '.......X'],
  sword: ['......XX', '.....XXX', '....XXX.', 'X..XXX..', '.XXXX...', '..XX....', '.X.XX...', 'X...X...'],
  chest: ['.XXXXXX.', 'X......X', 'XXXXXXXX', 'X..XX..X', 'X..XX..X', 'X......X', 'X......X', 'XXXXXXXX'],
  pad: ['........', '.XXXXXX.', 'XXXXXXXX', 'X.XXXX.X', '...XX..X', 'X.XXXXXX', 'XXX..XXX', '.X....X.'],
  play: ['.X......', '.XX.....', '.XXX....', '.XXXX...', '.XXXX...', '.XXX....', '.XX.....', '.X......'],
  arrow: ['...XX...', '...XX...', '...XX...', '...XX...', 'XXXXXXXX', '.XXXXXX.', '..XXXX..', '...XX...'],
  pin: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XXX..XXX', '.XXXXXX.', '..XXXX..', '...XX...', '...XX...'],
  scroll: ['XXXXXXX.', 'X.....XX', '.X.XX.X.', '.X....X.', '.X.XXXX.', '.X....X.', 'XX.....X', '.XXXXXXX'],
  bolt: ['....XXX.', '...XXX..', '..XXX...', '.XXXXXX.', '...XXX..', '..XXX...', '.XX.....', 'X.......'],
  close: ['XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..', '..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX'],
  down: ['........', '.......X', '......XX', 'XXXXXXXX', 'XXXXXXXX', '......XX', '.......X', '........'],
} as const;

export type IconName = keyof typeof ICONS;

export function PixelIcon({
  name,
  size = 16,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const rows = ICONS[name];
  const rects: string[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === 'X') rects.push(`M${x} ${y}h1v1h-1z`);
  });
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path d={rects.join('')} fill="currentColor" />
    </svg>
  );
}

// Player sprite — a hooded dev in brand lime, two walk frames.
const PALETTE: Record<string, string> = {
  H: '#2a1d14',
  S: '#c98e64',
  E: '#0b0b0b',
  L: '#b6f36b',
  D: '#7cb646',
  P: '#3b3b44',
  W: '#f3efe2',
};
const FRAMES = [
  [
    '...HHHHH..',
    '..HHHHHHH.',
    '..HHSSSES.',
    '..HSSSSSS.',
    '...SSSSS..',
    '..LLLLLL..',
    '.LLLDLLLL.',
    '.SLLDLLLS.',
    '..LLLLLL..',
    '..PPPPPP..',
    '..PP..PP..',
    '..PP..PP..',
    '.WWW..WWW.',
  ],
  [
    '...HHHHH..',
    '..HHHHHHH.',
    '..HHSSSES.',
    '..HSSSSSS.',
    '...SSSSS..',
    '..LLLLLL..',
    '.LLLDLLLL.',
    '..SLDLLS..',
    '..LLLLLL..',
    '..PPPPPP..',
    '...PPPP...',
    '...PPPP...',
    '..WWWWW...',
  ],
];

function framePaths(frame: readonly string[]) {
  const byColor: Record<string, string> = {};
  frame.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (c === '.') continue;
      byColor[c] = (byColor[c] ?? '') + `M${x} ${y}h1v1h-1z`;
    }
  });
  return byColor;
}
const FRAME_PATHS = FRAMES.map(framePaths);

export function Sprite({ frame = 0, size = 60, flip = false }: { frame?: number; size?: number; flip?: boolean }) {
  const paths = FRAME_PATHS[frame % FRAME_PATHS.length];
  return (
    <svg
      width={size}
      height={(size * 13) / 10}
      viewBox="0 0 10 13"
      className="sprite"
      shapeRendering="crispEdges"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, display: 'block' }}
      aria-hidden="true"
    >
      {Object.entries(paths).map(([c, d]) => (
        <path key={c} d={d} fill={PALETTE[c]} />
      ))}
    </svg>
  );
}

// Dithered pixel dissolve used where a dark band meets a lime band (dense at the bottom, sparse at the top).
const EDGE_DENSITY = [0.08, 0.28, 0.55, 0.85];
export function PixelEdge({ color, flip = false, seed = 7 }: { color: string; flip?: boolean; seed?: number }) {
  const cols = 64;
  const rows = EDGE_DENSITY.length;
  let s = seed;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let d = '';
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) if (rand() < EDGE_DENSITY[y]) d += `M${x} ${y}h1v1h-1z`;
  return (
    <svg
      className="pixel-edge"
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <path d={d} fill={color} />
    </svg>
  );
}
