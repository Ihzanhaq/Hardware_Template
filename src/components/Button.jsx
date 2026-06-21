import { Link } from 'react-router-dom'
import { classNames } from '../lib/format.js'

const VARIANTS = {
  primary:
    'bg-ink text-cream hover:bg-steel-800 dark:bg-cream dark:text-ink dark:hover:bg-brand-200',
  outline:
    'border border-current text-content hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink',
  ghost: 'text-content hover:bg-brand-100/70 dark:hover:bg-steel-800/60',
  brand: 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-[0.8rem]',
  lg: 'px-8 py-4 text-sm',
}

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const classes = classNames(
    'group inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-[0.18em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  const Tag = as
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  )
}
