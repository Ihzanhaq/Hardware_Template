import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Recalculate trigger positions once late-loading assets (images/fonts)
// have settled so scroll reveals fire at the correct scroll points.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh())
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {})
  }
}

export const EASE = 'power3.out'

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Fade + rise reveal for a single element. */
export function reveal(target, opts = {}) {
  return gsap.from(target, {
    y: opts.y ?? 48,
    opacity: 0,
    duration: opts.duration ?? 1,
    ease: opts.ease ?? EASE,
    delay: opts.delay ?? 0,
    scrollTrigger: opts.scrollTrigger ?? {
      trigger: target,
      start: opts.start ?? 'top 86%',
      toggleActions: 'play none none none',
    },
  })
}

/** Staggered reveal for a set of children. */
export function staggerReveal(targets, opts = {}) {
  return gsap.from(targets, {
    y: opts.y ?? 44,
    opacity: 0,
    duration: opts.duration ?? 0.9,
    ease: opts.ease ?? EASE,
    stagger: opts.stagger ?? 0.1,
    scrollTrigger: opts.trigger
      ? { trigger: opts.trigger, start: opts.start ?? 'top 82%', toggleActions: 'play none none none' }
      : undefined,
  })
}

export { gsap, ScrollTrigger }
