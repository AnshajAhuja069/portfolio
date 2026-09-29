/**
 * Drawn iceberg shapes used to *explain* the Gamersberg identity (the real
 * logo and Peak renders are separate image files). Faceted in the logo's
 * palette: ice white → sky blue → deep navy.
 */

type Pt = [number, number];

const tri = (a: Pt, b: Pt, c: Pt) => `${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`;

/* ---------- Underwater mass (viewBox 0 0 600 440, top edge = waterline) ---------- */

const DEPTH_OUTLINE: Pt[] = [
  [90, 0], [50, 80], [20, 210], [70, 340], [180, 420],
  [330, 440], [440, 380], [540, 250], [570, 120], [510, 0],
];
const DEPTH_CENTER: Pt = [300, 190];
const DEPTH_FILLS = [
  "#1b4c9c", "#133d84", "#0f3070", "#0b2659", "#081d47",
  "#0a2252", "#0d2b63", "#113677", "#16428c", "#2458ad",
];

export function IcebergDepth({ id = "depth" }: { id?: string }) {
  const fade = `${id}-fade`;
  return (
    <svg viewBox="0 0 600 440" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id={fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030a1f" stopOpacity="0" />
          <stop offset="0.55" stopColor="#030a1f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#030a1f" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <DepthFacets />
      <rect x="0" y="0" width="600" height="440" fill={`url(#${fade})`} />
    </svg>
  );
}

export function DepthFacets({ dx = 0, dy = 0 }: { dx?: number; dy?: number }) {
  return (
    <g transform={`translate(${dx} ${dy})`} stroke="rgb(170 210 255 / 0.14)" strokeWidth="1" strokeLinejoin="round">
      {DEPTH_OUTLINE.map((p, i) => (
        <polygon key={i} points={tri(p, DEPTH_OUTLINE[(i + 1) % DEPTH_OUTLINE.length], DEPTH_CENTER)} fill={DEPTH_FILLS[i]} />
      ))}
    </g>
  );
}

/* ---------- Tip above the waterline (viewBox units, waterline at y = 260) ---------- */

const TIP: { p: [Pt, Pt, Pt]; f: string }[] = [
  { p: [[150, 260], [205, 150], [200, 260]], f: "#7fb6ff" },
  { p: [[205, 150], [235, 185], [200, 260]], f: "#5a9bf0" },
  { p: [[235, 185], [300, 95], [262, 200]], f: "#e3f1ff" },
  { p: [[200, 260], [235, 185], [262, 200]], f: "#3d7bd8" },
  { p: [[262, 200], [300, 95], [300, 260]], f: "#bfdbff" },
  { p: [[200, 260], [262, 200], [300, 260]], f: "#2c63c4" },
  { p: [[300, 95], [365, 185], [338, 200]], f: "#8fbfff" },
  { p: [[300, 95], [338, 200], [300, 260]], f: "#4f8be6" },
  { p: [[338, 200], [365, 185], [400, 260]], f: "#1e4fa6" },
  { p: [[300, 260], [338, 200], [400, 260]], f: "#173f8c" },
  { p: [[365, 185], [395, 150], [400, 260]], f: "#6fa9f5" },
  { p: [[395, 150], [450, 260], [400, 260]], f: "#12357a" },
];

export function TipFacets() {
  return (
    <g stroke="rgb(230 244 255 / 0.25)" strokeWidth="1" strokeLinejoin="round">
      {TIP.map((t, i) => (
        <polygon key={i} points={tri(...t.p)} fill={t.f} />
      ))}
    </g>
  );
}

/** Infinity sign centred on the iceberg face (x 300, y 212). */
export const INFINITY_PATH =
  "M300 212 C318 188 350 182 368 196 C386 210 380 236 356 238 C334 240 318 226 300 212 C282 198 266 184 244 186 C220 188 214 214 232 228 C250 242 282 236 300 212 Z";

/** Infinity-shaped mask with two eye openings (fill-rule evenodd). */
export const MASK_PATH =
  "M196 206 C196 184 222 174 252 180 C272 184 288 194 300 194 C312 194 328 184 348 180 C378 174 404 184 404 206 C404 230 384 248 356 250 C330 252 314 238 300 238 C286 238 270 252 244 250 C216 248 196 230 196 206 Z " +
  "M226 212 C226 200 242 196 256 202 C266 206 274 212 280 216 C270 220 260 226 248 227 C234 228 226 222 226 212 Z " +
  "M374 212 C374 200 358 196 344 202 C334 206 326 212 320 216 C330 220 340 226 352 227 C366 228 374 222 374 212 Z";
