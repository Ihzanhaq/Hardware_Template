import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ShoppingCart,
  Heart,
  Check,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'
import Img from '../components/Img.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import RatingStars from '../components/RatingStars.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import NotFound from './NotFound.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProductById, getRelatedProducts } from '../data/products.js'
import { gsap, prefersReducedMotion } from '../lib/animations.js'
import { formatPrice, classNames } from '../lib/format.js'
import { CATEGORY_KEYWORDS } from '../lib/images.js'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) return <NotFound />
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const { addItem } = useCart()
  const related = useMemo(() => getRelatedProducts(product, 4), [product])
  const fallbackKw = CATEGORY_KEYWORDS[product.category] || 'tools,hardware'

  const [activeImage, setActiveImage] = useState(0)
  const [variant, setVariant] = useState(product.variants[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [liked, setLiked] = useState(false)

  const pageRef = useRef(null)
  const mainImgRef = useRef(null)

  // Intro reveal on mount
  useLayoutEffect(() => {
    const el = pageRef.current
    if (!el) return undefined
    const gallery = el.querySelector('[data-pd="gallery"]')
    const info = el.querySelectorAll('[data-pd="info"] > *')
    if (prefersReducedMotion()) {
      gsap.set([gallery, ...info], { opacity: 1, clearProps: 'all' })
      return undefined
    }
    const ctx = gsap.context(() => {
      gsap.from(gallery, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.out' })
      gsap.from(info, { y: 26, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', delay: 0.15 })
    }, el)
    return () => ctx.revert()
  }, [])

  // Crossfade when switching gallery image
  useEffect(() => {
    if (!mainImgRef.current || prefersReducedMotion()) return
    gsap.fromTo(mainImgRef.current, { opacity: 0.35, scale: 1.04 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' })
  }, [activeImage])

  const handleAdd = () => {
    addItem(product, { variant, quantity: qty })
    setAdded(true)
  }

  useEffect(() => {
    if (!added) return undefined
    const t = setTimeout(() => setAdded(false), 2200)
    return () => clearTimeout(t)
  }, [added])

  const unitPrice = product.salePrice ?? product.price

  return (
    <div ref={pageRef} className="pt-24 lg:pt-28">
      {/* Breadcrumb */}
      <nav className="container-px flex items-center gap-2 py-6 font-mono text-xs uppercase tracking-[0.12em] text-muted">
        <Link to="/" className="hover:text-content">Home</Link>
        <ChevronRight size={13} />
        <Link to="/shop" className="hover:text-content">Shop</Link>
        <ChevronRight size={13} />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-content">
          {product.category}
        </Link>
      </nav>

      <section className="container-px grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div data-pd="gallery" className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-square overflow-hidden border border-line surface-elevated">
            <Img
              key={activeImage}
              innerRef={mainImgRef}
              src={product.images[activeImage]}
              alt={product.name}
              loading="eager"
              fallbackKeywords={fallbackKw}
              fallbackSize={{ w: 1000, h: 1000 }}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-brand-500 px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white">
                {product.badge === 'Sale' ? `Save ${Math.round(product.discountPercentage)}%` : product.badge}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                className={classNames(
                  'relative aspect-square overflow-hidden border-2 transition-all duration-300',
                  i === activeImage ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <Img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fallbackKeywords={fallbackKw}
                  fallbackSize={{ w: 200, h: 200 }}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div data-pd="info" className="flex flex-col">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
            {product.brand} &middot; {product.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-[1.08] tracking-tight text-content sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">SKU {product.sku}</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            {product.onSale ? (
              <>
                <span className="font-display text-3xl font-bold text-content">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="pb-1 text-lg text-muted line-through">{formatPrice(product.price)}</span>
                <span className="mb-1 rounded-full bg-brand-100 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                  Save {Math.round(product.discountPercentage)}%
                </span>
              </>
            ) : (
              <span className="font-display text-3xl font-bold text-content">{formatPrice(product.price)}</span>
            )}
            <span className="pb-1.5 text-xs text-muted">incl. tax</span>
          </div>

          <p className="mt-6 max-w-lg leading-relaxed text-muted">{product.description}</p>

          {/* Variant selector */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-content">Option</span>
              <span className="text-sm text-muted">{variant}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={classNames(
                    'rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300',
                    variant === v
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-line text-content hover:border-content',
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + actions */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center justify-between rounded-full border border-line px-2 sm:w-36">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-11 w-11 place-items-center rounded-full text-content transition-colors hover:bg-brand-100/60 dark:hover:bg-steel-800/60"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-6 text-center font-medium text-content">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock || 10, q + 1))}
                aria-label="Increase quantity"
                className="grid h-11 w-11 place-items-center rounded-full text-content transition-colors hover:bg-brand-100/60 dark:hover:bg-steel-800/60"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              type="button"
              variant="brand"
              size="lg"
              onClick={handleAdd}
              disabled={!product.inStock}
              className={classNames('flex-1', added && 'bg-green-600!')}
            >
              {!product.inStock ? (
                'Out of stock'
              ) : added ? (
                <>
                  <Check size={16} /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Add to cart &mdash; {formatPrice(unitPrice * qty)}
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              aria-label="Add to wishlist"
              aria-pressed={liked}
              className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-line text-content transition-colors hover:border-content"
            >
              <Heart size={18} className={liked ? 'fill-brand-500 text-brand-500' : ''} />
            </button>
          </div>

          <p className="mt-4 text-sm text-muted">
            {product.inStock ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> In stock ({product.stock}) &mdash; ships within 1-2 days
              </span>
            ) : (
              <span className="text-brand-600">Currently out of stock</span>
            )}
          </p>

          {/* Assurances */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, label: 'Free shipping over $99' },
              { Icon: ShieldCheck, label: '2-year warranty' },
              { Icon: RotateCcw, label: '30-day returns' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 rounded-2xl border border-line surface-elevated px-4 py-3">
                <Icon size={18} className="shrink-0 text-brand-500" />
                <span className="text-xs text-muted">{label}</span>
              </div>
            ))}
          </div>

          {/* Specs */}
          {product.specs.length > 0 && (
            <div className="mt-10">
              <h3 className="mb-4 font-display text-lg font-semibold text-content">Specifications</h3>
              <dl className="overflow-hidden rounded-2xl border border-line">
                {product.specs.map((s, i) => (
                  <div
                    key={s.label}
                    className={classNames(
                      'flex items-center justify-between gap-4 px-5 py-3.5 text-sm',
                      i % 2 === 0 ? 'surface-elevated' : 'surface',
                    )}
                  >
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="text-right font-medium text-content">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Accordions */}
          <div className="mt-8 divide-y divide-[rgb(var(--line))] border-y border-line">
            <Accordion title="Key features" defaultOpen>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-brand-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Shipping & delivery">
              <p>
                Free standard shipping on orders over $99. Stocked items are dispatched same or next
                working day, with tracked delivery in 1-3 working days. Trade accounts can arrange
                site delivery and bulk handling.
              </p>
            </Accordion>
            <Accordion title="Warranty & returns">
              <p>
                Every power tool is covered by a 2-year manufacturer warranty. Unused items can be
                returned within 30 days for a full refund. Faulty tools are repaired or replaced free
                of charge under warranty.
              </p>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-px py-16 lg:py-24">
          <SectionHeading eyebrow="// Pairs well with" title="Complete the kit" className="mb-12" />
          <Reveal stagger amount={0.08} className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        </section>
      )}
    </div>
  )
}

function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg font-semibold text-content">{title}</span>
        <Plus
          size={18}
          className={classNames('text-muted transition-transform duration-300', open && 'rotate-45')}
        />
      </button>
      <div
        className={classNames(
          'grid overflow-hidden text-sm leading-relaxed text-muted transition-all duration-400 ease-smooth',
          open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0">{children}</div>
      </div>
    </div>
  )
}
