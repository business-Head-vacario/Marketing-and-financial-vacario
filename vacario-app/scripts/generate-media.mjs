/**
 * Generates the demo media that ships with the seed data — no binary assets in
 * git, no network calls at build time. Photos, covers, avatars and logos are
 * written as SVG; the 360° panoramas are real equirectangular PNGs so the
 * three.js viewer has something genuine to wrap around a sphere.
 *
 *   node scripts/generate-media.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "seed");
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ PNG */

function crc32(buf) {
  let c;
  const table = crc32.table ?? (crc32.table = Array.from({ length: 256 }, (_, n) => {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  }));
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function encodePng(width, height, rgb) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0; // filter: none
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const mix = (a, b, t) => a.map((value, i) => value + (b[i] - value) * t);

/**
 * Equirectangular panorama: longitude wraps seamlessly because every horizontal
 * term is a whole-number harmonic of the azimuth.
 */
function panorama({ width = 1600, height = 800, sky, horizonTint, ground, sunAt = 0.3, ridge = 1, water = false }) {
  const rgb = Buffer.alloc(width * height * 3);
  const horizon = height * 0.52;

  for (let x = 0; x < width; x++) {
    const u = x / width;
    const a = u * Math.PI * 2;
    const ridgeHeight =
      horizon -
      height *
        (0.05 * ridge * (1 + Math.sin(a * 3 + 0.6)) +
          0.035 * ridge * (1 + Math.sin(a * 5 + 2.1)) +
          0.02 * ridge * (1 + Math.sin(a * 9 + 4.2)));
    const ridgeBack = horizon - height * (0.03 * ridge * (1 + Math.sin(a * 2 + 1.4)) + 0.02);

    for (let y = 0; y < height; y++) {
      const v = y / height;
      let colour;

      if (y < ridgeBack) {
        colour = mix(sky[0], sky[1], Math.min(1, (v / 0.52) ** 0.8));
        // sun glow
        const dx = Math.min(Math.abs(u - sunAt), 1 - Math.abs(u - sunAt));
        const dy = v - 0.3;
        const d = Math.sqrt((dx * 2.4) ** 2 + dy ** 2);
        if (d < 0.34) colour = mix(colour, [255, 246, 214], Math.max(0, 1 - d / 0.34) ** 2.2);
      } else if (y < ridgeHeight) {
        colour = mix(horizonTint, sky[1], 0.35 + 0.4 * ((ridgeHeight - y) / height));
      } else if (y < horizon) {
        colour = mix(horizonTint, [30, 32, 48], 0.25 + 0.5 * ((y - ridgeHeight) / (horizon - ridgeHeight + 1)));
      } else {
        const t = (y - horizon) / (height - horizon);
        colour = mix(ground[0], ground[1], t ** 0.7);
        if (water) {
          const ripple = Math.sin(a * 26 + y * 0.35) * (1 - t) * 14;
          colour = colour.map((value) => value + ripple);
        }
      }

      const offset = (y * width + x) * 3;
      rgb[offset] = clamp(colour[0]);
      rgb[offset + 1] = clamp(colour[1]);
      rgb[offset + 2] = clamp(colour[2]);
    }
  }
  return encodePng(width, height, rgb);
}

const PANORAMAS = {
  "pano-pangong": { sky: [[16, 42, 120], [96, 186, 236]], horizonTint: [86, 122, 168], ground: [[24, 92, 148], [12, 44, 92]], water: true, sunAt: 0.22, ridge: 1.2 },
  "pano-jaisalmer": { sky: [[236, 122, 56], [255, 206, 128]], horizonTint: [214, 146, 84], ground: [[214, 168, 104], [124, 88, 52]], sunAt: 0.62, ridge: 0.35 },
  "pano-munnar": { sky: [[92, 168, 214], [206, 238, 240]], horizonTint: [104, 152, 108], ground: [[62, 122, 68], [24, 62, 42]], sunAt: 0.8, ridge: 0.9 },
  "pano-maldives": { sky: [[38, 132, 200], [180, 232, 246]], horizonTint: [96, 196, 200], ground: [[36, 176, 186], [10, 96, 132]], water: true, sunAt: 0.45, ridge: 0.15 },
  "pano-spiti": { sky: [[28, 66, 148], [154, 206, 240]], horizonTint: [138, 128, 122], ground: [[130, 112, 96], [58, 48, 44]], sunAt: 0.12, ridge: 1.5 },
  "pano-goa": { sky: [[250, 120, 92], [255, 198, 128]], horizonTint: [232, 148, 116], ground: [[210, 152, 110], [92, 70, 66]], water: true, sunAt: 0.5, ridge: 0.2 },
};

/* ------------------------------------------------------------------ SVG */

const PALETTES = [
  ["#ff5a1f", "#ff2d87", "#7c3aed"],
  ["#23cbc4", "#2563eb", "#1e1b4b"],
  ["#f59e0b", "#ef4444", "#7c2d12"],
  ["#34d399", "#0ea5e9", "#064e3b"],
  ["#a855f7", "#ec4899", "#312e81"],
  ["#fbbf24", "#fb7185", "#4c1d95"],
];

function scene({ id, label, sub, palette, kind }) {
  const [c1, c2, c3] = palette;
  const sun = kind === "night" ? "#fde68a" : "#fff7cc";
  const width = 1200;
  const height = kind === "portrait" ? 1500 : kind === "wide" ? 630 : 900;
  const horizon = height * 0.68;

  const hills =
    kind === "beach"
      ? `<path d="M0 ${horizon} Q ${width * 0.25} ${horizon - 40} ${width * 0.5} ${horizon} T ${width} ${horizon} V ${height} H0 Z" fill="${c3}" opacity="0.85"/>
         <path d="M0 ${horizon + 60} Q ${width * 0.3} ${horizon + 20} ${width * 0.6} ${horizon + 70} T ${width} ${horizon + 40} V ${height} H0 Z" fill="#0b3b52" opacity="0.8"/>`
      : `<path d="M0 ${horizon} L ${width * 0.22} ${horizon - height * 0.26} L ${width * 0.38} ${horizon - height * 0.08} L ${width * 0.58} ${horizon - height * 0.33} L ${width * 0.78} ${horizon - height * 0.06} L ${width} ${horizon - height * 0.18} V ${height} H0 Z" fill="${c3}" opacity="0.92"/>
         <path d="M0 ${horizon + height * 0.06} L ${width * 0.3} ${horizon - height * 0.06} L ${width * 0.52} ${horizon + height * 0.05} L ${width * 0.74} ${horizon - height * 0.1} L ${width} ${horizon + height * 0.02} V ${height} H0 Z" fill="#131427" opacity="0.75"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="55%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${c3}"/>
    </linearGradient>
    <radialGradient id="sun-${id}" cx="0.72" cy="0.22" r="0.3">
      <stop offset="0%" stop-color="${sun}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${sun}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#sky-${id})"/>
  <circle cx="${width * 0.72}" cy="${height * 0.22}" r="${height * 0.09}" fill="${sun}" opacity="0.9"/>
  <rect width="${width}" height="${height}" fill="url(#sun-${id})"/>
  ${hills}
  <g opacity="0.5" fill="#ffffff">
    ${Array.from({ length: 26 }, (_, i) => {
      const cx = ((i * 137) % width) + 10;
      const cy = ((i * 89) % (horizon * 0.7)) + 20;
      return `<circle cx="${cx}" cy="${cy}" r="${(i % 3) + 1.2}" opacity="${0.25 + ((i % 5) * 0.1)}"/>`;
    }).join("")}
  </g>
  <text x="60" y="${height - 92}" font-family="Outfit, Verdana, sans-serif" font-size="${height * 0.062}" font-weight="800" fill="#ffffff" opacity="0.96">${label}</text>
  <text x="62" y="${height - 48}" font-family="Verdana, sans-serif" font-size="${height * 0.028}" fill="#ffffff" opacity="0.8">${sub}</text>
</svg>`;
}

const PHOTOS = [
  ["pangong", "Pangong Tso", "Ladakh · 4,350 m", "mountain"],
  ["spiti", "Key Monastery", "Spiti Valley · sunrise", "mountain"],
  ["varkala", "Varkala Cliff", "Kerala · monsoon light", "beach"],
  ["jaisalmer", "Sam Dunes", "Jaisalmer · golden hour", "mountain"],
  ["meghalaya", "Living Root Bridge", "Meghalaya · double-decker", "mountain"],
  ["goa", "Palolem Beach", "South Goa · low season", "beach"],
  ["rishikesh", "Ganga Aarti", "Rishikesh · 6pm", "mountain"],
  ["andaman", "Radhanagar", "Havelock · Andamans", "beach"],
  ["hampi", "Boulder Sunset", "Hampi · Karnataka", "mountain"],
  ["kaza", "Chandratal Camp", "Spiti · 4,250 m", "mountain"],
  ["munnar", "Tea Country", "Munnar · first light", "mountain"],
  ["bali", "Rice Terraces", "Tegallalang · Bali", "mountain"],
  ["maldives", "Overwater Villa", "Maldives · Baa Atoll", "beach"],
  ["kashmir", "Dal Lake", "Srinagar · shikara hour", "beach"],
  ["coorg", "Coffee Estate", "Coorg · mist season", "mountain"],
  ["udaipur", "Lake Pichola", "Udaipur · blue hour", "beach"],
  ["tawang", "Sela Pass", "Arunachal · 4,170 m", "mountain"],
  ["gokarna", "Om Beach", "Gokarna · sunset walk", "beach"],
];

for (const [id, label, sub, kind] of PHOTOS) {
  const palette = PALETTES[PHOTOS.findIndex((p) => p[0] === id) % PALETTES.length];
  writeFileSync(path.join(OUT, `photo-${id}.svg`), scene({ id, label, sub, palette, kind }));
  writeFileSync(
    path.join(OUT, `reel-${id}.svg`),
    scene({ id: `r-${id}`, label, sub, palette, kind: "portrait" }),
  );
}

const COVERS = [
  ["cover-himalaya", "Himalaya Trails", "small-group treks since 2011"],
  ["cover-coastal", "Coastal Co.", "islands, reefs and slow boats"],
  ["cover-desert", "Desert Routes", "Rajasthan, off the tourist grid"],
  ["cover-traveller", "On the road", "42 trips and counting"],
  ["cover-backpack", "Budget backpacking", "India on ₹1,500 a day"],
  ["cover-luxe", "Luxe Escapes", "villas, spas and long lunches"],
];
COVERS.forEach(([id, label, sub], index) => {
  writeFileSync(
    path.join(OUT, `${id}.svg`),
    scene({ id, label, sub, palette: PALETTES[index % PALETTES.length], kind: "wide" }),
  );
});

function avatar(id, initials, palette) {
  const [c1, c2] = palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs><linearGradient id="a-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="200" height="200" rx="100" fill="url(#a-${id})"/>
  <text x="100" y="128" text-anchor="middle" font-family="Outfit, Verdana, sans-serif" font-size="76" font-weight="800" fill="#ffffff" opacity="0.95">${initials}</text>
</svg>`;
}

const AVATARS = [
  ["ananya", "AR"],
  ["dev", "DK"],
  ["meera", "MP"],
  ["arjun", "AS"],
  ["farah", "FQ"],
  ["kabir", "KM"],
  ["himalaya", "HT"],
  ["coastal", "CC"],
  ["desert", "DR"],
  ["admin", "VA"],
];
AVATARS.forEach(([id, initials], index) => {
  writeFileSync(path.join(OUT, `avatar-${id}.svg`), avatar(id, initials, PALETTES[index % PALETTES.length]));
});

function logo(id, text, palette) {
  const [c1, c2] = palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">
  <defs><linearGradient id="l-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="240" height="240" rx="52" fill="url(#l-${id})"/>
  <path d="M40 168 L92 84 L124 132 L152 96 L200 168 Z" fill="#ffffff" opacity="0.9"/>
  <circle cx="172" cy="66" r="20" fill="#fff7cc"/>
  <text x="120" y="216" text-anchor="middle" font-family="Outfit, Verdana, sans-serif" font-size="30" font-weight="800" fill="#ffffff">${text}</text>
</svg>`;
}

[
  ["himalaya", "HIMALAYA", PALETTES[1]],
  ["coastal", "COASTAL", PALETTES[3]],
  ["desert", "DESERT", PALETTES[2]],
].forEach(([id, text, palette]) => writeFileSync(path.join(OUT, `logo-${id}.svg`), logo(id, text, palette)));

writeFileSync(path.join(OUT, "itinerary-cover.svg"), scene({ id: "itin", label: "Trip plan", sub: "day by day", palette: PALETTES[0], kind: "wide" }));

for (const [name, config] of Object.entries(PANORAMAS)) {
  writeFileSync(path.join(OUT, `${name}.png`), panorama(config));
}

console.log(`generated ${PHOTOS.length * 2 + COVERS.length + AVATARS.length + 4 + Object.keys(PANORAMAS).length} demo files in public/seed`);
