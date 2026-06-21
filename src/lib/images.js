/**
 * Imagery helpers.
 *
 * Most photography is pulled from LoremFlickr by keyword with a stable `lock`
 * value, so slots show real, situation-matched photos that stay consistent
 * between reloads. Product images use strict keyword normalization because
 * phrase queries like "cordless drill" can drift into unrelated lifestyle shots.
 * The resilient <Img /> component falls back further if any single URL fails.
 */

const FLICKR = 'https://loremflickr.com'

export function lifestyle(keywords, { w = 1200, h = 1500, lock = 1 } = {}) {
  const kw = (Array.isArray(keywords) ? keywords : String(keywords).split(','))
    .map((k) => encodeURIComponent(k.trim()))
    .filter(Boolean)
    .join(',')
  return `${FLICKR}/${w}/${h}/${kw}?lock=${lock}`
}

export const CATEGORY_KEYWORDS = {
  'Power Tools': 'power tool,drill',
  'Hand Tools': 'wrench,tools',
  'Safety Equipment': 'safety glasses,helmet',
  'Building Materials': 'lumber,bricks',
  Electrical: 'electrical wire,tools',
  'Garden Tools': 'garden tools',
}

// Manually managed category hero images.
// Replace any URL below with your preferred image for that category.
export const CATEGORY_IMAGES = {
  "Power Tools":
    "https://ideas.fepy.com/wp-content/uploads/2023/08/best_power_tool_sets_hero_image-scaled.jpeg.optimal.jpeg",
  "Hand Tools": "https://images.unsplash.com/featured/?hand-tools",
  "Safety Equipment":
    "https://static.vecteezy.com/system/resources/thumbnails/074/377/323/small/essential-personal-protective-equipment-ppe-for-industrial-safety-and-workplace-protection-on-wood-photo.jpeg",
  "Building Materials":
    "https://mccoymart.com/post/wp-content/uploads/07-May-24-Building-Materials.jpg",
  Electrical:
    "https://m.media-amazon.com/images/I/715FVG4vY7L._AC_UF1000,1000_QL80_.jpg",
  "Garden Tools":
    "https://images.meesho.com/images/products/864404401/jdvqc_512.webp?width=512",
};

export function categoryImage(category, opts = {}) {
  return CATEGORY_IMAGES[category] || lifestyle(CATEGORY_KEYWORDS[category] || 'tools,hardware', opts)
}

/**
 * Build a small gallery of distinct, topic-matched shots for a product. Each
 * image reuses the product keywords with a different lock seed for variety.
 */
export function productImages(keywords, seed = 1, count = 4, size = { w: 900, h: 1100 }) {
  const base = 400 + (Math.abs(Number(seed)) % 500) * 7
  const query = productImageQuery(keywords)
  return Array.from({ length: count }, (_, i) =>
    lifestyle(query, { ...size, lock: base + i * 17 }),
  )
}

const PRODUCT_IMAGE_QUERIES = {
  'cordless drill': 'drill,tool',
  'circular saw': 'saw,tool',
  'angle grinder': 'grinder,tool',
  'impact driver': 'drill,driver,tool',
  sander: 'sander,tool',
  'power saw': 'saw,power-tool',
  'claw hammer': 'hammer,tool',
  'adjustable wrench': 'wrench,tool',
  screwdriver: 'screwdriver,tool',
  pliers: 'pliers,tool',
  'socket wrench': 'socket,wrench',
  'utility knife': 'utility-knife,tool',
  'drill bits': 'drill-bit,tool',
  'drill bit': 'drill-bit,tool',
  'saw blade': 'saw-blade,tool',
  'jigsaw blade': 'saw-blade,tool',
  'wood screws': 'screws,hardware',
  'bolts nuts': 'bolts,nuts',
  'wall plugs': 'wall-anchor,hardware',
  nails: 'nails,hardware',
  'tape measure': 'tape-measure,tool',
  'spirit level': 'level,tool',
  caliper: 'caliper,tool',
  'measure tool': 'laser-measure,tool',
  'safety glasses': 'safety-glasses',
  'work gloves': 'work-gloves',
  'hard hat': 'hard-hat,helmet',
  'ear protection': 'earmuffs,safety',
  'tool chest': 'tool-chest,toolbox',
  toolbox: 'toolbox,tools',
  'tool bag': 'tool-bag,tools',
  'pegboard tools': 'pegboard,tools',
  'pruning shears': 'pruning-shears,garden',
  chainsaw: 'chainsaw,tool',
  'shovel garden': 'shovel,garden',
  'leaf blower': 'leaf-blower,garden',
}

function productImageQuery(keywords) {
  const key = String(keywords).trim().toLowerCase()
  if (PRODUCT_IMAGE_QUERIES[key]) return PRODUCT_IMAGE_QUERIES[key]
  return key
    .replace(/&/g, ',')
    .split(/[,\s]+/)
    .filter(Boolean)
    .slice(0, 3)
    .join(',')
}

// Curated feature slots used across the site.
export const HERO = {
  primary: lifestyle('power tool,workshop', { w: 1400, h: 1700, lock: 1101 }),
  secondary: lifestyle('cordless drill', { w: 600, h: 750, lock: 1102 }),
  tertiary: lifestyle('tools,workbench', { w: 900, h: 1100, lock: 1103 }),
}

export const EDITORIAL = {
  workshop:
    "https://images.pexels.com/photos/31501005/pexels-photo-31501005.jpeg",
  detail: lifestyle("tools,metal", { w: 1000, h: 1200, lock: 1202 }),
};

export const CTA_BG = lifestyle('workshop,garage,tools', { w: 1600, h: 900, lock: 1301 })

export const TESTIMONIAL_AVATARS = [
  lifestyle('portrait,man,face', { w: 200, h: 200, lock: 1401 }),
  lifestyle('portrait,worker,face', { w: 200, h: 200, lock: 1402 }),
  lifestyle('portrait,woman,face', { w: 200, h: 200, lock: 1403 }),
]
