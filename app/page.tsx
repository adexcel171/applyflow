import { Metadata } from 'next'
import Link from 'next/link'
import connectDB from '@/lib/db'
import Job, { IJob } from '@/models/Job'
import { MapPin, Clock, DollarSign, ArrowRight, Zap, Users, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ApplyFlow — Where Opportunity Meets Ambition',
}

export const revalidate = 60

async function getActiveJobs() {
  try {
    await connectDB()
    const jobs = await Job.find({ isActive: true })
      .select('title slug shortDescription location locationType salary employmentType tags applicationCount')
      .sort({ createdAt: -1 })
      .lean()
    return JSON.parse(JSON.stringify(jobs)) as Partial<IJob>[]
  } catch {
    return []
  }
}

const employmentColors: Record<string, string> = {
  'full-time': 'bg-emerald-50 text-emerald-700',
  'part-time': 'bg-blue-50 text-blue-700',
  'contract': 'bg-purple-50 text-purple-700',
  'internship': 'bg-orange-50 text-orange-700',
  'scholarship': 'bg-pink-50 text-pink-700',
}

const locationColors: Record<string, string> = {
  'remote': 'bg-teal-50 text-teal-700',
  'hybrid': 'bg-indigo-50 text-indigo-700',
  'onsite': 'bg-amber-50 text-amber-700',
}

export default async function HomePage() {
  const jobs = await getActiveJobs()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl text-surface-900">ApplyFlow</span>
          </Link>
          <Link href="/admin" className="btn-ghost text-sm py-2 px-4">
            Admin →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 to-surface-900 text-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            {jobs.length} {jobs.length === 1 ? 'opportunity' : 'opportunities'} open now
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Where Opportunity
            <br />
            <span className="text-gradient-warm">Meets Ambition</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-body">
            ApplyFlow connects driven individuals with transformative jobs, scholarships, and programs. Apply in minutes. Change your trajectory.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#opportunities" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 text-base px-8 py-4">
              Explore Opportunities
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
            {[
              { icon: Users, label: 'Applicants', value: '12,400+' },
              { icon: Star, label: 'Success Rate', value: '94%' },
              { icon: Zap, label: 'Avg. Response', value: '48hrs' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-brand-300 mx-auto mb-1" />
                <div className="text-2xl font-bold font-display">{value}</div>
                <div className="text-xs text-white/50 font-body mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 720 0 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Opportunities */}
      <section id="opportunities" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="mb-12">
          <h2 className="font-display text-4xl font-bold text-surface-900 mb-3">
            Open Opportunities
          </h2>
          <p className="text-surface-500 font-body text-lg">
            Hand-picked roles and programs accepting applications right now.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-24 text-surface-400 font-body">
            <p className="text-6xl mb-4">🔭</p>
            <p className="text-xl font-medium text-surface-600">No opportunities open right now.</p>
            <p className="mt-2">Check back soon — new listings drop weekly.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={String(job._id)}
                href={`/jobs/${job.slug}`}
                className="group card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`badge ${employmentColors[job.employmentType || 'full-time']}`}>
                      {job.employmentType}
                    </span>
                    <span className={`badge ${locationColors[job.locationType || 'remote']}`}>
                      {job.locationType}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-surface-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <h3 className="font-display text-xl font-bold text-surface-900 mb-2 group-hover:text-brand-700 transition-colors">
                  {job.title}
                </h3>
                <p className="text-surface-500 text-sm font-body leading-relaxed mb-5 flex-1 line-clamp-2">
                  {job.shortDescription}
                </p>

                <div className="space-y-2 border-t border-surface-100 pt-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-surface-500 font-body">
                    <MapPin className="w-3.5 h-3.5 text-surface-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-surface-500 font-body">
                    <DollarSign className="w-3.5 h-3.5 text-surface-400" />
                    {job.salary}
                  </div>
                  {(job.applicationCount ?? 0) > 0 && (
                    <div className="flex items-center gap-2 text-sm text-surface-400 font-body">
                      <Users className="w-3.5 h-3.5" />
                      {job.applicationCount} applied
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 bg-surface-50 py-12 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-surface-800">ApplyFlow</span>
          </div>
          <p className="text-sm text-surface-400 font-body">
            © {new Date().getFullYear()} ApplyFlow. Built to unlock potential.
          </p>
        </div>
      </footer>
    </div>
  )
}
