import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { classNames } from '../lib/format.js'

/**
 * Forge wordmark: a forged amber tool mark + bold display lettering.
 * `tone` controls colour so it reads on both light surfaces and the dark footer.
 */
export default function Logo({ to = '/', className = '', tone = 'content', size = 'md' }) {
  const text = tone === 'cream' ? 'text-cream' : 'text-content'
  const mark =
    tone === 'cream'
      ? 'bg-cream/10 text-brand-400'
      : 'bg-ink text-brand-400 dark:bg-cream/10'

  const sizes = {
    md: { wrap: 'text-xl', box: 'h-8 w-8', icon: 16 },
    lg: { wrap: 'text-3xl', box: 'h-11 w-11', icon: 22 },
  }
  const s = sizes[size] || sizes.md

  return (
    <Link
      to={to}
      aria-label="Forge — home"
      className={classNames('group inline-flex items-center gap-2.5', className)}
    >
      <span
        className={classNames(
          'grid place-items-center rounded-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-12deg]',
          s.box,
          mark,
        )}
      >
        <Wrench size={s.icon} />
      </span>
      <span className={classNames('font-display font-bold uppercase tracking-tight', s.wrap, text)}>
        Forge<span className="text-brand-500">.</span>
      </span>
    </Link>
  )
}
