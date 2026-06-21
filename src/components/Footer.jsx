import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Phone, Mail } from 'lucide-react'
import Logo from './Logo.jsx'
import { Instagram, Facebook, Youtube, LinkedIn } from './icons/Social.jsx'
import { CATEGORIES } from '../data/products.js'

const COMPANY = ['About Forge', 'Trade Account', 'Store Finder', 'Careers', 'Press']
const SUPPORT = ['Shipping & Delivery', 'Returns & Warranty', 'Track My Order', 'Contact Us', 'FAQs']
const SOCIALS = [
  { Icon: Instagram, label: 'Instagram' },
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Youtube, label: 'YouTube' },
  { Icon: LinkedIn, label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-cream">
      <div className="container-px py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Logo to="/" tone="cream" size="lg" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
              Pro-grade tools and hardware for trades and serious DIY. Built to take a beating and
              keep working, job after job.
            </p>
            <ul className="mt-7 space-y-2.5 text-sm text-cream/70">
              <li className="flex items-center gap-3">
                <Phone size={15} className="shrink-0 text-brand-400" /> 1-800-FORGE-01
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="shrink-0 text-brand-400" /> support@forgetools.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={15} className="shrink-0 text-brand-400" /> 14 Anvil Way, Industrial Park
              </li>
            </ul>
            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-400"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop">
            {CATEGORIES.map((c) => (
              <FooterLink key={c} to={`/shop?category=${encodeURIComponent(c)}`}>
                {c}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Company">
            {COMPANY.map((c) => (
              <FooterLink key={c} to="/shop">
                {c}
              </FooterLink>
            ))}
          </FooterColumn>

          <div>
            <h4 className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream/50">
              Trade Newsletter
            </h4>
            <p className="mt-5 text-sm leading-relaxed text-cream/70">
              Tool drops, deals, and jobsite tips. No spam—just gear.
            </p>
            <form
              className="mt-5 flex items-center gap-2 border-b border-cream/25 pb-2 focus-within:border-brand-400"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full bg-transparent text-sm text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition-transform duration-300 hover:scale-105"
              >
                <ArrowUpRight size={16} />
              </button>
            </form>
            <ul className="mt-7 space-y-2.5">
              {SUPPORT.slice(0, 3).map((h) => (
                <li key={h}>
                  <FooterLink to="/shop">{h}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/15 pt-8 text-xs text-cream/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Forge Tools &amp; Hardware. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="link-underline hover:text-cream">
              Privacy
            </a>
            <a href="#" className="link-underline hover:text-cream">
              Terms
            </a>
            <span>Built for demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-cream/50">
        {title}
      </h4>
      <ul className="mt-5 space-y-2.5">
        {Array.isArray(children) ? children.map((child, i) => <li key={i}>{child}</li>) : children}
      </ul>
    </div>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="link-underline text-sm text-cream/70 transition-colors hover:text-cream"
    >
      {children}
    </Link>
  )
}
