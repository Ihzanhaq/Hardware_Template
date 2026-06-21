import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Truck, Check } from 'lucide-react'
import Img from '../components/Img.jsx'
import Button from '../components/Button.jsx'
import Reveal from '../components/Reveal.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, classNames } from '../lib/format.js'
import { CATEGORY_KEYWORDS } from '../lib/images.js'

export default function Cart() {
  const {
    items,
    count,
    subtotal,
    savings,
    shipping,
    total,
    freeShippingRemaining,
    freeShippingThreshold,
    increment,
    decrement,
    removeItem,
    clear,
  } = useCart()
  const [placed, setPlaced] = useState(false)

  if (placed) return <OrderConfirmation onContinue={() => setPlaced(false)} />

  if (count === 0) {
    return (
      <section className="container-px flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full border border-line text-muted">
          <ShoppingCart size={28} />
        </span>
        <h1 className="mt-8 font-display text-4xl font-bold text-content sm:text-5xl">Your cart is empty</h1>
        <p className="mt-4 max-w-md text-muted">
          Looks like you haven&apos;t added any gear yet. Let&apos;s find the right tool for the job.
        </p>
        <Button to="/shop" variant="brand" size="lg" className="mt-8">
          Start shopping <ArrowRight size={16} />
        </Button>
      </section>
    )
  }

  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100)

  return (
    <div className="container-px pt-24 lg:pt-28">
      <Reveal className="py-8">
        <p className="eyebrow">// Your cart</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-content sm:text-5xl">
          Cart &amp; checkout
        </h1>
        <p className="mt-3 text-muted">
          {count} {count === 1 ? 'item' : 'items'} ready to go
        </p>
      </Reveal>

      <div className="grid gap-10 pb-20 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        {/* Line items */}
        <div>
          {/* Free shipping progress */}
          <div className="mb-8 rounded-2xl border border-line surface-elevated p-5">
            <div className="flex items-center gap-2 text-sm text-content">
              <Truck size={16} className="text-brand-500" />
              {freeShippingRemaining > 0 ? (
                <span>
                  You&apos;re <strong>{formatPrice(freeShippingRemaining)}</strong> away from free shipping
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Check size={16} className="text-green-500" /> You&apos;ve unlocked free shipping
                </span>
              )}
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-100 dark:bg-steel-800">
              <div
                className="h-full rounded-full bg-brand-500 transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-[rgb(var(--line))] border-y border-line">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-6 sm:gap-6">
                <Link
                  to={`/product/${item.id}`}
                  className="relative aspect-square w-24 shrink-0 overflow-hidden border border-line surface-elevated sm:w-28"
                >
                  <Img
                    src={item.image}
                    alt={item.name}
                    fallbackKeywords={CATEGORY_KEYWORDS[item.category] || 'tools,hardware'}
                    fallbackSize={{ w: 200, h: 200 }}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                        {item.brand}
                      </p>
                      <Link
                        to={`/product/${item.id}`}
                        className="link-underline mt-1 inline-block font-display text-base font-medium text-content"
                      >
                        {item.name}
                      </Link>
                      {item.variant && item.variant !== 'Standard' && (
                        <p className="mt-1 text-sm text-muted">{item.variant}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Remove ${item.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-brand-100/60 hover:text-brand-600 dark:hover:bg-steel-800/60"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => decrement(item.key)}
                        aria-label="Decrease quantity"
                        className="grid h-9 w-9 place-items-center rounded-full text-content transition-colors hover:bg-brand-100/60 dark:hover:bg-steel-800/60"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium text-content">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increment(item.key)}
                        aria-label="Increase quantity"
                        className="grid h-9 w-9 place-items-center rounded-full text-content transition-colors hover:bg-brand-100/60 dark:hover:bg-steel-800/60"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-content">{formatPrice(item.unitPrice * item.quantity)}</p>
                      {item.unitPrice !== item.price && (
                        <p className="text-xs text-muted line-through">{formatPrice(item.price * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <Link to="/shop" className="link-underline font-mono text-[0.72rem] uppercase tracking-[0.12em] text-content">
              Continue shopping
            </Link>
            <button
              type="button"
              onClick={clear}
              className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand-600"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-line surface-elevated p-7">
            <h2 className="font-display text-2xl font-semibold text-content">Order summary</h2>
            <dl className="mt-6 space-y-3.5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              {savings > 0 && <Row label="Savings" value={`-${formatPrice(savings)}`} accent />}
              <Row label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
              <Row label="Estimated tax" value="Calculated at checkout" muted />
            </dl>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
              <span className="font-display text-lg font-semibold text-content">Total</span>
              <span className="font-display text-2xl font-bold text-content">{formatPrice(total)}</span>
            </div>

            <Button type="button" variant="brand" size="lg" className="mt-7 w-full" onClick={() => setPlaced(true)}>
              Checkout <ArrowRight size={16} />
            </Button>

            <p className="mt-4 text-center text-xs text-muted">
              Secure checkout. This is a demo store&mdash;no payment is taken.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 text-muted">
              {['VISA', 'MC', 'AMEX', 'PAY'].map((p) => (
                <span key={p} className="rounded-md border border-line px-2.5 py-1 font-mono text-[0.6rem] font-semibold tracking-wider">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value, muted = false, accent = false }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd
        className={classNames(
          accent ? 'text-brand-600 dark:text-brand-400' : muted ? 'text-muted' : 'text-content',
          'font-medium',
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function OrderConfirmation({ onContinue }) {
  const { clear } = useCart()
  return (
    <section className="container-px flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-500 text-white">
        <Check size={32} />
      </span>
      <h1 className="mt-8 font-display text-4xl font-bold text-content sm:text-5xl">Order confirmed</h1>
      <p className="mt-4 max-w-md text-muted">
        Thanks for your order! A confirmation has been sent to your email and your gear is being
        prepped for dispatch. (This is a demo&mdash;no payment was processed.)
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button
          to="/shop"
          variant="brand"
          size="lg"
          onClick={() => {
            clear()
            onContinue()
          }}
        >
          Continue shopping
        </Button>
      </div>
    </section>
  )
}
