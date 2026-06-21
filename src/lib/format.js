const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatPrice(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return ''
  return currency.format(value)
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ')
}
