import { useReveal } from '../hooks/useGsapReveal.js'

/**
 * Wrapper that reveals itself (or staggers its children) on scroll.
 *
 * <Reveal>...</Reveal>                    -> fades/rises the block
 * <Reveal stagger>...children...</Reveal> -> staggers direct children
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  stagger = false,
  y,
  duration,
  start,
  amount,
  ...rest
}) {
  const ref = useReveal({ stagger, y, duration, start, amount })
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
