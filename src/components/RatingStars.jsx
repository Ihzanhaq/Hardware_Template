import { Star } from 'lucide-react'
import { classNames } from '../lib/format.js'

export default function RatingStars({ rating = 0, reviewCount, size = 14, className = '' }) {
  const rounded = Math.round(rating)
  return (
    <div className={classNames('flex items-center gap-1.5', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={i < rounded ? 'fill-brand-400 text-brand-400' : 'fill-transparent text-steel-300 dark:text-steel-600'}
          />
        ))}
      </div>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-muted">
          {rating.toFixed(1)} ({reviewCount})
        </span>
      )}
    </div>
  )
}
