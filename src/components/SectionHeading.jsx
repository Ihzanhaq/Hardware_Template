import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { classNames } from '../lib/format.js'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
  align = 'left',
  className = '',
}) {
  return (
    <div
      className={classNames(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-content sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-xl text-muted">{description}</p>}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="link-underline group inline-flex shrink-0 items-center gap-2 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-content"
        >
          {actionLabel}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
