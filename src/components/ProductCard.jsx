import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Img from './Img.jsx'
import RatingStars from './RatingStars.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, classNames } from '../lib/format.js'
import { CATEGORY_KEYWORDS } from '../lib/images.js'

const BADGE_STYLES = {
  Sale: 'bg-brand-500 text-white',
  New: 'bg-ink text-cream dark:bg-cream dark:text-ink',
  Bestseller: 'bg-steel-200 text-steel-800 dark:bg-steel-700 dark:text-steel-100',
}

export default function ProductCard({ product, className = '' }) {
  const { addItem } = useCart()
  const hoverImage = product.images?.[1] || product.images?.[0] || product.thumbnail
  const fallbackKw = CATEGORY_KEYWORDS[product.category] || 'tools,hardware'

  const quickAdd = () => {
    addItem(product, { variant: product.variants?.[0] ?? null, quantity: 1 })
  }

  return (
    <article className={classNames('group/card flex flex-col', className)}>
      <div className="relative overflow-hidden border border-line surface-elevated">
        <div className="relative aspect-square w-full overflow-hidden">
          <Img
            src={product.thumbnail}
            alt={product.name}
            fallbackKeywords={fallbackKw}
            fallbackSize={{ w: 600, h: 600 }}
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-900 ease-smooth group-hover/card:scale-105 group-hover/card:opacity-0"
          />
          <Img
            src={hoverImage}
            alt={`${product.name} alternate view`}
            fallbackKeywords={fallbackKw}
            fallbackSize={{ w: 600, h: 600 }}
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-0 transition-all duration-900 ease-smooth group-hover/card:scale-100 group-hover/card:opacity-100"
          />
        </div>

        {/* full-card click target */}
        <Link to={`/product/${product.id}`} aria-label={product.name} className="absolute inset-0 z-10" />

        {product.badge && (
          <span
            className={classNames(
              'absolute left-3 top-3 z-20 rounded-full px-3 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em]',
              BADGE_STYLES[product.badge],
            )}
          >
            {product.badge === 'Sale' ? `-${Math.round(product.discountPercentage)}%` : product.badge}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute right-3 top-3 z-20 rounded-full bg-ink/80 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cream">
            Out of stock
          </span>
        )}

        <button
          type="button"
          onClick={quickAdd}
          className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 translate-y-4 items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white opacity-0 shadow-lg shadow-brand-500/30 transition-all duration-400 ease-smooth hover:bg-brand-600 group-hover/card:translate-y-0 group-hover/card:opacity-100"
        >
          <Plus size={14} />
          Quick add
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
            {product.brand}
          </p>
          <RatingStars rating={product.rating} size={12} />
        </div>
        <Link
          to={`/product/${product.id}`}
          className="link-underline self-start font-display text-base font-medium leading-snug text-content"
        >
          {product.name}
        </Link>
        <div className="mt-0.5 flex items-center gap-2">
          {product.onSale ? (
            <>
              <span className="font-semibold text-content">{formatPrice(product.salePrice)}</span>
              <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-semibold text-content">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </article>
  )
}
