import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, X, PackageSearch } from 'lucide-react'
import ProductCard from '../components/ProductCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { getAllProducts, CATEGORIES, PRICE_BOUNDS } from '../data/products.js'
import { classNames, formatPrice } from '../lib/format.js'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const effectivePrice = (p) => p.salePrice ?? p.price

function sortProducts(list, sort) {
  const arr = [...list]
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => effectivePrice(a) - effectivePrice(b))
    case 'price-desc':
      return arr.sort((a, b) => effectivePrice(b) - effectivePrice(a))
    case 'rating':
      return arr.sort((a, b) => b.rating - a.rating)
    case 'new':
      return arr.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id)
    default:
      return arr.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
  }
}

const PRICE_CEIL = Math.ceil(PRICE_BOUNDS.max / 10) * 10

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'All'
  const sort = params.get('sort') || 'featured'

  const [query, setQuery] = useState('')
  const [maxPrice, setMaxPrice] = useState(PRICE_CEIL)

  const products = useMemo(() => {
    let base = category === 'All' ? getAllProducts() : getAllProducts().filter((p) => p.category === category)
    const q = query.trim().toLowerCase()
    if (q) {
      base = base.filter((p) =>
        `${p.name} ${p.brand} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(q),
      )
    }
    base = base.filter((p) => effectivePrice(p) <= maxPrice)
    return sortProducts(base, sort)
  }, [category, sort, query, maxPrice])

  const setCategory = (c) => {
    const next = new URLSearchParams(params)
    if (c === 'All') next.delete('category')
    else next.set('category', c)
    setParams(next, { replace: true })
  }

  const setSort = (s) => {
    const next = new URLSearchParams(params)
    if (s === 'featured') next.delete('sort')
    else next.set('sort', s)
    setParams(next, { replace: true })
  }

  const resetFilters = () => {
    setQuery('')
    setMaxPrice(PRICE_CEIL)
    setCategory('All')
  }

  const chips = ['All', ...CATEGORIES]
  const priceFiltered = maxPrice < PRICE_CEIL

  return (
    <div className="pt-24 lg:pt-28">
      {/* Page header */}
      <section className="container-px pb-10 pt-8">
        <Reveal>
          <p className="eyebrow">// The catalog</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-content sm:text-5xl lg:text-6xl">
            {category === 'All' ? 'Shop all tools' : category}
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Pro-grade gear, filtered fast. Search by name or brand, set your budget, and sort to find
            the right tool for the job.
          </p>
        </Reveal>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 z-30 border-y border-line surface-overlay backdrop-blur-xl md:top-20">
        <div className="container-px flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chips.map((c) => {
                const active = c === category
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={classNames(
                      'shrink-0 rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] transition-all duration-300',
                      active
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-line text-muted hover:border-content hover:text-content',
                    )}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <label className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">
                <SlidersHorizontal size={15} />
                Sort
              </label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="cursor-pointer appearance-none rounded-full border border-line surface px-5 py-2 pr-9 text-sm text-content transition-colors hover:border-content focus:border-brand-500 focus:outline-none"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                  &#9662;
                </span>
              </div>
            </div>
          </div>

          {/* Secondary row: search + price */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools or brands..."
                className="w-full rounded-full border border-line surface py-2.5 pl-10 pr-9 text-sm text-content placeholder:text-muted focus:border-brand-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-content"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted">Max</span>
              <input
                type="range"
                min={Math.floor(PRICE_BOUNDS.min)}
                max={PRICE_CEIL}
                step={5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="h-1 w-40 cursor-pointer accent-brand-500"
                aria-label="Maximum price"
              />
              <span className="min-w-16 text-sm font-medium text-content">{formatPrice(maxPrice)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container-px py-12 lg:py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          {(query || priceFiltered || category !== 'All') && (
            <button
              type="button"
              onClick={resetFilters}
              className="link-underline font-mono text-[0.72rem] uppercase tracking-[0.12em] text-content"
            >
              Reset filters
            </button>
          )}
        </div>

        {products.length > 0 ? (
          <Reveal
            key={`${category}-${sort}-${query}-${maxPrice}`}
            stagger
            amount={0.05}
            y={36}
            className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Reveal>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line py-24 text-center">
            <PackageSearch size={30} className="text-muted" />
            <p className="text-muted">No tools match your filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="link-underline font-mono text-[0.72rem] uppercase tracking-[0.12em] text-content"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
