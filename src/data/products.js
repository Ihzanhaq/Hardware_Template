import catalog from './catalog.json'

/**
 * Product data layer.
 * Source: a hand-authored hardware catalog (catalog.json) enriched here with
 * light ecommerce fields used by the UI. Product images come directly from
 * the catalog instead of generated keyword photos.
 */

function round2(n) {
  return Math.round(n * 100) / 100
}

const products = catalog.map((p) => {
  const name = p.title || p.name
  const brand = p.brand || 'Forge Supply'
  const sku = p.sku || `FRG-${String(p.id).padStart(4, '0')}`
  const rating = p.rating ?? round2(4.2 + ((p.id * 7) % 8) / 10)
  const stock = p.stock ?? 24 + ((p.id * 13) % 90)
  const discountPercentage = p.discountPercentage ?? (p.id % 6 === 0 ? 12 : 0)
  const onSale = discountPercentage >= 15
  const salePrice = onSale ? round2(p.price * (1 - discountPercentage / 100)) : null
  const bestseller = rating >= 4.6
  const isNew = p.id % 5 === 0 || p.id % 7 === 0
  const reviewCount = p.reviews ?? 24 + ((p.id * 17) % 320)

  let badge = null
  if (onSale) badge = 'Sale'
  else if (isNew) badge = 'New'
  else if (bestseller) badge = 'Bestseller'

  const images = p.images && p.images.length ? p.images : [p.image]
  const tags = p.tags || []

  return {
    id: p.id,
    name,
    brand,
    sku,
    price: p.price,
    salePrice,
    onSale,
    discountPercentage,
    category: p.category,
    description:
      p.description ||
      `${name} is a reliable ${p.category.toLowerCase()} essential, selected for trade-ready performance and everyday jobs.`,
    tags,
    rating,
    reviewCount,
    stock,
    inStock: stock > 0,
    imageKw: p.imageKw || tags.join(',') || p.category,
    thumbnail: images[0],
    images,
    specs:
      p.specs || [
        { label: 'Brand', value: brand },
        { label: 'SKU', value: sku },
        { label: 'Category', value: p.category },
        { label: 'Stock', value: `${stock} available` },
      ],
    features:
      p.features ||
      [
        `Rated ${rating.toFixed(1)} from ${reviewCount.toLocaleString()} reviews`,
        'Curated hardware product selection',
        'Ready for home, garage, and trade use',
        'Ships from available stock',
      ],
    variants: p.variants && p.variants.length ? p.variants : ['Standard'],
    badge,
    isNew,
    bestseller,
  }
})

const CATEGORY_ORDER = [
  'Power Tools',
  'Hand Tools',
  'Safety Equipment',
  'Building Materials',
  'Electrical',
  'Garden Tools',
]

export const CATEGORIES = Array.from(new Set(products.map((p) => p.category))).sort(
  (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b),
)

export const PRICE_BOUNDS = products.reduce(
  (acc, p) => ({
    min: Math.min(acc.min, p.salePrice ?? p.price),
    max: Math.max(acc.max, p.price),
  }),
  { min: Infinity, max: 0 },
)

export function getAllProducts() {
  return products
}

export function getProductById(id) {
  return products.find((p) => String(p.id) === String(id)) || null
}

export function getProductsByCategory(category) {
  if (!category || category === 'All') return products
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(product, limit = 4) {
  if (!product) return []
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, limit)
}

export function getNewArrivals(limit = 8) {
  return [...products].filter((p) => p.isNew).concat(products).slice(0, limit)
}

export function getBestSellers(limit = 8) {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function getFeatured(limit = 6) {
  return [...products]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, limit)
}

export default products
