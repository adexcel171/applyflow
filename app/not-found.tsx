import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-surface-900 to-brand-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow mb-6">
          <Zap className="w-8 h-8 text-white" fill="currentColor" />
        </div>

        <div className="font-display text-8xl font-bold text-white/10 mb-2">404</div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          Opportunity Not Found
        </h1>
        <p className="text-white/60 font-body text-base mb-8 leading-relaxed">
          This opportunity may have closed, moved, or never existed. But don&apos;t worry — there are plenty more waiting for you.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-brand-700 bg-white hover:bg-brand-50 transition-all shadow-glow font-body"
        >
          ← Back to All Opportunities
        </Link>
      </div>
    </div>
  )
}
