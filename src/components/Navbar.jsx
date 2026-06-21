import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { Menu, ShoppingCart, X } from 'lucide-react'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useCart } from '../context/CartContext.jsx'
import { gsap, prefersReducedMotion } from '../lib/animations.js'
import { classNames } from '../lib/format.js'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop All', to: '/shop' },
  { label: 'Power Tools', to: '/shop?category=Power+Tools' },
  { label: 'Hand Tools', to: '/shop?category=Hand+Tools' },
  { label: 'Safety', to: '/shop?category=Safety+Equipment' },
  { label: 'Electrical', to: '/shop?category=Electrical' },
]

export default function Navbar() {
  const { count } = useCart()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const badgeRef = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (badgeRef.current && !prefersReducedMotion()) {
      gsap.fromTo(badgeRef.current, { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
    }
  }, [count])

  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth',
        scrolled
          ? 'border-b border-line surface-overlay backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-px flex h-16 items-center justify-between gap-6 md:h-20">
        <Logo />

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'link-underline font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-colors',
                    isActive ? 'text-content' : 'text-muted hover:text-content',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            to="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
            className="group relative grid h-10 w-10 place-items-center rounded-full border border-line text-content transition-colors duration-300 hover:border-brand-400 hover:text-brand-500 dark:hover:bg-steel-800/60"
          >
            <ShoppingCart size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            {count > 0 && (
              <span
                ref={badgeRef}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[0.65rem] font-semibold text-white"
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-content transition-colors duration-300 hover:border-brand-400 lg:hidden dark:hover:bg-steel-800/60"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={classNames(
          'lg:hidden',
          'overflow-hidden border-t border-line surface transition-[max-height,opacity] duration-500 ease-smooth',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="container-px flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'block rounded-xl px-4 py-3 font-display text-lg font-medium transition-colors',
                    isActive
                      ? 'bg-brand-100/60 text-content dark:bg-steel-800/60'
                      : 'text-muted hover:bg-brand-100/40 hover:text-content dark:hover:bg-steel-800/40',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
