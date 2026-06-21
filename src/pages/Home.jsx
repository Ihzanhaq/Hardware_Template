import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Quote,
  Drill,
  Wrench,
  Ruler,
  HardHat,
  Boxes,
  Sprout,
} from 'lucide-react'
import Button from '../components/Button.jsx'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'
import Marquee from '../components/Marquee.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { useParallax, useCountUp } from '../hooks/useGsapReveal.js'
import { gsap, prefersReducedMotion } from '../lib/animations.js'
import { getNewArrivals, getBestSellers } from '../data/products.js'
import { EDITORIAL, CTA_BG, categoryImage, lifestyle, TESTIMONIAL_AVATARS } from '../lib/images.js'
import { classNames } from '../lib/format.js'

const HERO_SLIDES = [
  {
    eyebrow: 'Pro tools & hardware',
    title: ['Built to', 'outlast', 'the job.'],
    description:
      'Power tools, hand tools, and hardware engineered for the trade and priced for the crew.',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=85',
    fallback: 'contractor,power tool',
    imageAlt: 'Contractor cutting timber with a power saw in a workshop',
    primaryCta: 'Shop all tools',
    primaryTo: '/shop',
    secondaryCta: 'Browse power tools',
    secondaryTo: '/shop?category=Power+Tools',
  },
  {
    eyebrow: 'Cordless systems',
    title: ['More torque.', 'Less downtime.'],
    description:
      'Brushless drills, drivers, saws, and grinders built around jobsite-ready battery kits.',
    image:
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=1800&q=85',
    fallback: 'cordless drill,battery',
    imageAlt: 'Cordless drill and battery tools arranged on a workbench',
    primaryCta: 'Shop power tools',
    primaryTo: '/shop?category=Power+Tools',
    secondaryCta: 'View best sellers',
    secondaryTo: '/shop?sort=rating',
  },
  {
    eyebrow: 'Workshop essentials',
    title: ['Every fix', 'starts here.'],
    description:
      'From socket sets and levels to safety gear and storage, stock the bench with dependable essentials.',
    image:
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1800&q=85',
    fallback: 'mechanic,tools,garage',
    imageAlt: 'Mechanic workshop with tool chest and hand tools',
    primaryCta: 'Shop hand tools',
    primaryTo: '/shop?category=Hand+Tools',
    secondaryCta: 'Explore storage',
    secondaryTo: '/shop?category=Tool+Storage',
  },
]

const COLLECTIONS = [
  { category: 'Power Tools', label: 'Power Tools', Icon: Drill, kw: 'power tool,drill', lock: 2201, span: 'lg:row-span-2' },
  { category: 'Hand Tools', label: 'Hand Tools', Icon: Wrench, kw: 'wrench,tools', lock: 2202, span: '' },
  { category: 'Safety Equipment', label: 'Safety Equipment', Icon: HardHat, kw: 'safety,helmet', lock: 2203, span: '' },
  { category: 'Building Materials', label: 'Building Materials', Icon: Boxes, kw: 'lumber,bricks', lock: 2204, span: 'lg:col-span-2' },
  { category: 'Electrical', label: 'Electrical', Icon: Ruler, kw: 'electrical,wire', lock: 2205, span: '' },
  { category: 'Garden Tools', label: 'Garden Tools', Icon: Sprout, kw: 'garden tools', lock: 2206, span: '' },
]

const TRADES = [
  { label: 'Carpentry', desc: 'Saws, drivers & measuring', kw: 'carpenter,wood', to: '/shop?category=Power+Tools', lock: 3101 },
  { label: 'Hand Tools', desc: 'Hammers, wrenches & drivers', kw: 'wrench,hammer', to: '/shop?category=Hand+Tools', lock: 3102 },
  { label: 'Electrical', desc: 'Bulbs, cords & breakers', kw: 'electrician,wire', to: '/shop?category=Electrical', lock: 3103 },
  { label: 'Materials', desc: 'Concrete, lumber & bricks', kw: 'construction,materials', to: '/shop?category=Building+Materials', lock: 3104 },
  { label: 'Safety', desc: 'Helmets, goggles & masks', kw: 'safety,helmet', to: '/shop?category=Safety+Equipment', lock: 3105 },
  { label: 'Garden', desc: 'Shovels, shears & hoses', kw: 'gardening,tools', to: '/shop?category=Garden+Tools', lock: 3106 },
]

const VALUES = [
  { Icon: Truck, title: 'Free shipping over $99', text: 'Fast dispatch on stocked items, right to the site.' },
  { Icon: ShieldCheck, title: '2-year warranty', text: 'Every power tool is backed by a 2-year guarantee.' },
  { Icon: RotateCcw, title: '30-day returns', text: 'Not the right tool? Send it back, no fuss.' },
  { Icon: Headphones, title: 'Expert support', text: 'Talk to people who actually use the gear.' },
]

const TESTIMONIALS = [
  {
    quote:
      'I run a small build crew and these tools take a beating every day. The cordless drill has more torque than kit twice the price. Forge is now our go-to supplier.',
    name: 'Dwayne Okafor',
    role: 'Site Foreman',
  },
  {
    quote:
      'Ordered a full socket set and a tool chest on Tuesday, both on the van by Thursday. Quality is spot on and the warranty gives me real peace of mind.',
    name: 'Mara Jensen',
    role: 'Auto Technician',
  },
  {
    quote:
      'As a weekend renovator I want pro gear without the pro headache. The site is easy, the photos are honest, and everything has arrived exactly as described.',
    name: 'Tom Bradley',
    role: 'DIY Renovator',
  },
]

const STATS = [
  { end: 25, label: 'Years in the trade', format: (n) => `${Math.round(n)}+` },
  { end: 8, label: 'Tool categories', format: (n) => `${Math.round(n)}` },
  { end: 50, label: 'Pros equipped', format: (n) => `${Math.round(n)}k+` },
  { end: 4.8, label: 'Average rating', format: (n) => n.toFixed(1) },
]

export default function Home() {
  const newArrivals = getNewArrivals(8)
  const bestSellers = getBestSellers(4)

  return (
    <>
      <Hero />

      <Marquee
        className="border-y border-line py-4 font-mono text-sm uppercase tracking-[0.22em] text-content"
        items={[
          'Free Shipping Over $99',
          '2-Year Tool Warranty',
          'Trade Accounts Welcome',
          'Pro-Grade Gear',
          'Next-Day Dispatch',
        ]}
      />

      <Collections />
      <TradeShowcase />

      {/* New arrivals */}
      <section className="container-px py-20 lg:py-28">
        <SectionHeading
          eyebrow="// Just landed"
          title="New arrivals"
          description="The latest tools to hit the racks—fresh stock, ready to work."
          actionLabel="View all"
          actionTo="/shop?sort=new"
          className="mb-12"
        />
        <Reveal stagger amount={0.08} className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Reveal>
      </section>

      <Editorial />

      {/* Values */}
      <section className="container-px py-8">
        <Reveal
          stagger
          amount={0.08}
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map(({ Icon, title, text }) => (
            <div key={title} className="surface group flex flex-col gap-3 p-8 transition-colors duration-300 hover:bg-brand-50 dark:hover:bg-steel-900/40">
              <Icon size={26} className="text-brand-500 transition-transform duration-300 group-hover:-translate-y-1" />
              <h3 className="font-display text-lg font-semibold text-content">{title}</h3>
              <p className="text-sm text-muted">{text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Bestsellers */}
      <section className="container-px py-20 lg:py-28">
        <SectionHeading
          eyebrow="// Crew favourites"
          title="Best sellers"
          description="The workhorses our customers reorder again and again."
          actionLabel="Shop top rated"
          actionTo="/shop?sort=rating"
          className="mb-12"
        />
        <Reveal stagger amount={0.08} className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Reveal>
      </section>

      <Testimonials />
      <Newsletter />
    </>
  )
}

/* ----------------------------- Hero ----------------------------- */

function Hero() {
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  const progressRef = useRef(null)
  const [active, setActive] = useState(0)
  const slide = HERO_SLIDES[active]

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => window.clearInterval(id)
  }, [])

  useLayoutEffect(() => {
    const image = imageRef.current
    const content = contentRef.current
    const progress = progressRef.current
    if (!image || !content || prefersReducedMotion()) {
      if (progress) progress.style.width = '100%'
      return undefined
    }

    const lines = content.querySelectorAll('[data-hero="line"]')
    const fadeUp = content.querySelectorAll('[data-slide-animate]')
    const ctx = gsap.context(() => {
      gsap.killTweensOf([image, progress, ...lines, ...fadeUp])
      gsap.set(lines, { yPercent: 110 })
      gsap.set(fadeUp, { y: 24, opacity: 0 })
      if (progress) gsap.set(progress, { width: '0%' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        image,
        {
          clipPath: 'inset(0 18% 0 0)',
          filter: 'brightness(0.75)',
          scale: 1.12,
          opacity: 0.25,
          transformOrigin: '50% 50%',
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          filter: 'brightness(1)',
          scale: 1,
          opacity: 1,
          duration: 1.25,
        },
        0,
      )
        .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0.12)
        .fromTo(
          fadeUp,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, clearProps: 'transform,opacity' },
          0.32,
        )

      if (progress) {
        gsap.fromTo(progress, { width: '0%' }, { width: '100%', duration: 6.5, ease: 'none' }, 0)
      }
    }, heroRef.current)

    return () => ctx.revert()
  }, [active])

  const goTo = (next) => {
    setActive((next + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-[760px] overflow-hidden bg-ink pt-16 text-cream md:min-h-[820px] md:pt-20"
    >
      <div className="absolute inset-0">
        {HERO_SLIDES.map((item, i) => (
          <img
            key={item.image}
            ref={i === active ? imageRef : undefined}
            src={item.image}
            alt={item.imageAlt}
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = lifestyle(item.fallback, { w: 1600, h: 1000, lock: 1700 + i })
            }}
            className={classNames(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-smooth',
              i === active ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-ink/65 via-transparent to-ink/15" />
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-10" />
      </div>

      <div className="container-px relative flex min-h-[700px] items-center py-20 md:min-h-[740px]">
        <div key={`hero-copy-${active}`} ref={contentRef} className="max-w-3xl">
          <p data-slide-animate data-hero="eyebrow" className="mb-6 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-brand-400">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
            {slide.eyebrow}
          </p>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-tight text-cream sm:text-6xl lg:text-8xl">
            {slide.title.map((line, i) => (
              <span key={i} className="block overflow-hidden py-[0.04em]">
                <span data-hero="line" className={classNames('block', i === 1 && 'text-brand-500')}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p data-slide-animate data-hero="text" className="mt-7 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg">
            {slide.description}
          </p>
          <div data-slide-animate data-hero="cta" className="mt-9 flex flex-wrap items-center gap-4">
            <Button to={slide.primaryTo} variant="brand" size="lg">
              {slide.primaryCta}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              to={slide.secondaryTo}
              variant="outline"
              size="lg"
              className="border-cream text-cream hover:bg-cream hover:text-ink"
            >
              {slide.secondaryCta}
            </Button>
          </div>

          <div data-slide-animate data-hero="stats" className="mt-12 flex flex-wrap items-center gap-8">
            <div className="flex -space-x-3">
              {TESTIMONIAL_AVATARS.map((src, i) => (
                <Img
                  key={i}
                  src={src}
                  alt="Happy customer"
                  fallbackKeywords="portrait,face"
                  fallbackSize={{ w: 80, h: 80 }}
                  className="h-10 w-10 rounded-full border-2 border-cream/60 object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-brand-400 text-brand-400" />
                ))}
              </div>
              <p className="mt-1 text-sm text-cream/70">Trusted by 50,000+ pros</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-5 flex items-center gap-3 sm:left-8 lg:left-12">
          {HERO_SLIDES.map((item, i) => (
            <button
              key={item.eyebrow}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className={classNames(
                'relative h-2.5 overflow-hidden rounded-full transition-all duration-300',
                i === active ? 'w-12 bg-cream/25' : 'w-2.5 bg-cream/45 hover:bg-cream/80',
              )}
            >
              {i === active && (
                <span ref={progressRef} className="absolute inset-y-0 left-0 block rounded-full bg-brand-500" />
              )}
            </button>
          ))}
        </div>

        <div className="absolute bottom-7 right-5 flex items-center gap-2 md:bottom-24 lg:right-12">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous hero slide"
            className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 bg-black/30 text-cream backdrop-blur transition-colors hover:bg-cream hover:text-ink"
          >
            <ArrowRight size={16} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next hero slide"
            className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 bg-black/30 text-cream backdrop-blur transition-colors hover:bg-cream hover:text-ink"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Collections --------------------------- */

function Collections() {
  return (
    <section className="container-px py-20 lg:py-28">
      <SectionHeading
        eyebrow="// Departments"
        title="Shop by category"
        description="From 18V brushless power tools to the last box of screws—find exactly what the job needs."
        actionLabel="Browse everything"
        actionTo="/shop"
        className="mb-12"
      />
      <Reveal
        stagger
        amount={0.1}
        className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-3 lg:auto-rows-[260px]"
      >
        {COLLECTIONS.map((c) => (
          <Link
            key={c.category}
            to={`/shop?category=${encodeURIComponent(c.category)}`}
            className={classNames(
              'group/col relative overflow-hidden border border-line surface-elevated',
              c.span,
            )}
          >
            <Img
              src={categoryImage(c.category, { w: 800, h: 800, lock: c.lock })}
              alt={c.label}
              fallbackKeywords={c.kw}
              fallbackSize={{ w: 800, h: 800 }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1200 ease-smooth group-hover/col:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
              <div>
                <c.Icon size={22} className="mb-2 text-brand-400" />
                <h3 className="font-display text-xl font-semibold text-cream">{c.label}</h3>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white transition-transform duration-300 group-hover/col:rotate-45">
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  )
}

/* ---------------------- Trade showcase (pinned) ---------------------- */

function TradeShowcase() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!section || !wrapper || !track || prefersReducedMotion()) return undefined

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        wrapper.style.overflowX = 'hidden'
        const distance = () => Math.max(0, track.scrollWidth - wrapper.clientWidth)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + distance(),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        return () => {
          tween.kill()
          wrapper.style.overflowX = ''
        }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-line bg-ink py-16 text-cream lg:h-screen lg:py-0">
      <div className="lg:flex lg:h-full lg:flex-col lg:justify-center">
        <div className="container-px lg:pt-10">
          <p className="eyebrow mb-3 text-brand-400">// Built for your trade</p>
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-4xl lg:text-5xl">
            Kitted out for every trade on site.
          </h2>
          <p className="mt-4 max-w-xl text-cream/60">
            Scroll across to find the right gear for the job—whatever you build, fix, or grow.
          </p>
        </div>

        <div
          ref={wrapperRef}
          className="mt-10 overflow-x-auto pb-2 scrollbar-none lg:mt-12 lg:overflow-x-hidden lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          <div ref={trackRef} className="flex w-max gap-5 px-5 sm:px-8 lg:px-12">
            {TRADES.map((t) => (
              <Link
                key={t.label}
                to={t.to}
                className="group/trade relative h-[380px] w-[78vw] shrink-0 overflow-hidden border border-cream/10 sm:w-[58vw] lg:h-[58vh] lg:w-[36vw] xl:w-[420px]"
              >
                <Img
                  src={lifestyle(t.kw, { w: 800, h: 1000, lock: t.lock })}
                  alt={t.label}
                  fallbackKeywords={t.kw}
                  fallbackSize={{ w: 800, h: 1000 }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1200 ease-smooth group-hover/trade:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brand-400">Trade</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-cream">{t.label}</h3>
                  <p className="mt-1 text-sm text-cream/60">{t.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-cream">
                    Shop now
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover/trade:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Editorial ---------------------------- */

function Editorial() {
  const imgRef = useParallax({ amount: 16, scale: 1.2 })
  return (
    <section id="about" className="relative overflow-hidden py-20 lg:py-28">
      <div className="container-px grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow mb-4">// The workshop</p>
          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-content sm:text-4xl lg:text-5xl">
            Tools chosen by people <br /> who actually use them.
          </h2>
          <p className="mt-5 max-w-lg text-muted">
            We don&apos;t list anything we wouldn&apos;t put in our own bag. Every tool is tested on
            real jobs for grip, balance, runtime, and durability—so when you reach for it, it just
            works. No filler, no fragile gimmicks.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <StatItem key={s.label} end={s.end} format={s.format} label={s.label} />
            ))}
          </div>
          <Button to="/shop" variant="outline" className="mt-10">
            Explore the range
          </Button>
        </Reveal>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-4/5 overflow-hidden border border-line surface-elevated lg:aspect-5/6">
            <img
              ref={imgRef}
              src={EDITORIAL.workshop}
              alt="Inside the Forge workshop"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ end, format, label }) {
  const ref = useCountUp(end, { format })
  return (
    <div>
      <p className="font-display text-3xl font-bold text-content sm:text-4xl">
        <span ref={ref}>{format(0)}</span>
      </p>
      <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">{label}</p>
    </div>
  )
}

/* --------------------------- Testimonials --------------------------- */

function Testimonials() {
  return (
    <section className="container-px py-20 lg:py-28">
      <SectionHeading eyebrow="// From the crew" title="Trusted on the tools" align="center" className="mb-14" />
      <Reveal stagger amount={0.12} className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={t.name}
            className="flex flex-col gap-5 rounded-3xl border border-line surface-elevated p-8 transition-transform duration-500 hover:-translate-y-1"
          >
            <Quote size={28} className="text-brand-500" />
            <blockquote className="leading-relaxed text-content/90">{t.quote}</blockquote>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={14} className="fill-brand-400 text-brand-400" />
              ))}
            </div>
            <figcaption className="mt-auto flex items-center gap-3 pt-2">
              <Img
                src={TESTIMONIAL_AVATARS[i % TESTIMONIAL_AVATARS.length]}
                alt={t.name}
                fallbackKeywords="portrait,face"
                fallbackSize={{ w: 96, h: 96 }}
                className="h-11 w-11 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-content">{t.name}</p>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  )
}

/* ---------------------------- Newsletter ---------------------------- */

function Newsletter() {
  const bgRef = useParallax({ amount: 18, scale: 1.25 })
  return (
    <section className="container-px pb-24 pt-4">
      <div className="relative overflow-hidden border border-line">
        <img
          ref={bgRef}
          src={CTA_BG}
          alt="Forge workshop interior"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="hazard-stripes absolute inset-x-0 top-0 h-1.5 opacity-90" />
        <Reveal className="relative px-6 py-20 text-center text-cream sm:px-10 lg:py-28">
          <p className="eyebrow mb-4 text-brand-400">// Join the trade list</p>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Tool drops, deals & jobsite tips.
          </h2>
          <form
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full rounded-full border border-cream/30 bg-cream/10 px-6 py-4 text-sm text-cream placeholder:text-cream/50 backdrop-blur focus:border-brand-400 focus:outline-none"
            />
            <Button type="submit" variant="brand" size="lg" className="shrink-0">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-cream/60">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------- hero intro timeline hook --------------------- */

function useIntroTimeline() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const lines = el.querySelectorAll('[data-hero="line"]')
    const fadeUp = el.querySelectorAll('[data-hero="eyebrow"], [data-hero="text"], [data-hero="cta"], [data-hero="stats"]')
    const chip = el.querySelector('[data-hero="chip"]')

    if (prefersReducedMotion()) {
      gsap.set([...lines, ...fadeUp, chip].filter(Boolean), { clearProps: 'all', opacity: 1, y: 0 })
      return undefined
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(lines, { yPercent: 115, duration: 1.05, stagger: 0.12 })
        .from(fadeUp, { y: 26, opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.6')
        .from(chip, { x: 30, opacity: 0, duration: 0.7 }, '-=0.6')
    }, el)
    return () => ctx.revert()
  }, [])
  return ref
}
