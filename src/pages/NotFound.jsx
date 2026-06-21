import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <section className="container-px flex min-h-[70vh] flex-col items-center justify-center pt-28 text-center">
      <p className="eyebrow">// Error 404</p>
      <h1 className="mt-4 font-display text-6xl font-bold uppercase tracking-tight text-content sm:text-8xl">
        Stripped <span className="text-brand-500">thread.</span>
      </h1>
      <p className="mt-5 max-w-md text-muted">
        This page has come loose and wandered off the bench. Let&apos;s get you back to the tools.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button to="/" variant="brand" size="lg">
          Back home
        </Button>
        <Button to="/shop" variant="outline" size="lg">
          Go to shop <ArrowRight size={16} />
        </Button>
      </div>
    </section>
  )
}
