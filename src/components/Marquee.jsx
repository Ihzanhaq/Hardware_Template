import { classNames } from '../lib/format.js'

/**
 * Infinite horizontal marquee. Content is duplicated so the CSS
 * translateX(-50%) loop is seamless. Pauses on hover.
 */
export default function Marquee({ items = [], className = '', separator = '\u2666', reverse = false }) {
  const sequence = (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={false}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="whitespace-nowrap">{item}</span>
          <span className="text-brand-500">{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className={classNames('group relative flex overflow-hidden', className)}>
      <div
        className={classNames(
          'flex min-w-full shrink-0 animate-[marquee_28s_linear_infinite] items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {sequence}
        {sequence}
      </div>
    </div>
  )
}
