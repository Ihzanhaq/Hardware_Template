import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/animations.js'

/**
 * Generic GSAP context hook. The `setup` callback runs inside a
 * gsap.context scoped to the returned ref, so all created tweens/triggers
 * are reverted automatically on unmount (and on dependency change).
 */
export function useGsap(setup, deps = []) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    if (!ref.current) return undefined
    if (prefersReducedMotion()) {
      gsap.set(ref.current.querySelectorAll('[data-animate]'), { clearProps: 'all', opacity: 1 })
      return undefined
    }
    const ctx = gsap.context((self) => setup(self, ref.current), ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}

/**
 * Reveal a container's direct children (or the element itself) on scroll.
 */
export function useReveal({ stagger = false, y = 44, duration = 0.9, start = 'top 85%', amount = 0.1 } = {}) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1 })
      gsap.set(el.children, { opacity: 1 })
      return undefined
    }
    const ctx = gsap.context(() => {
      const targets = stagger ? el.children : el
      gsap.from(targets, {
        y,
        opacity: 0,
        duration,
        ease: 'power3.out',
        stagger: stagger ? amount : 0,
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}

/**
 * Subtle parallax: translates the element vertically as it scrolls through
 * the viewport. Best used on an oversized image inside an overflow-hidden box.
 */
export function useParallax({ amount = 12, scale = 1.12 } = {}) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap.set(el, { scale })
      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, scale])
  return ref
}

/**
 * Count a number up from 0 to `end` when the element scrolls into view.
 * `format` lets callers add suffixes/decimals (e.g. "4.9", "12k+").
 */
export function useCountUp(end, { duration = 1.8, format = (n) => Math.round(n).toLocaleString() } = {}) {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) {
      el.textContent = format(end)
      return undefined
    }
    const obj = { val: 0 }
    el.textContent = format(0)
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: end,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(obj.val)
        },
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
      })
    }, el)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end])
  return ref
}
