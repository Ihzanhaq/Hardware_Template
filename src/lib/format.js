const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
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
