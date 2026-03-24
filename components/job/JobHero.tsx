'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Clock, DollarSign, Zap, ChevronDown, ArrowLeft } from 'lucide-react'
import { IJob } from '@/models/Job'
import { formatDate } from '@/lib/utils'

interface Props {
  job: IJob
}

const locationTypeConfig = {
  remote: { label: 'Remote', color: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' },
  hybrid: { label: 'Hybrid', color: 'bg-blue-400/20 text-blue-300 border-blue-400/30' },
  onsite: { label: 'On-site', color: 'bg-amber-400/20 text-amber-300 border-amber-400/30' },
}

const employmentConfig: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Contract',
  'internship': 'Internship',
  'scholarship': 'Scholarship',
}

export default function JobHero({ job }: Props) {
  // Track view
  useEffect(() => {
    fetch(`/api/jobs/${job._id}/view`, { method: 'POST' }).catch(() => {})
  }, [job._id])

  const locConfig = locationTypeConfig[job.locationType] || locationTypeConfig.remote

  return (
    <section className="relative bg-gradient-to-br from-brand-950 via-surface-900 to-brand-950 text-white overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white/80 text-sm font-body transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All opportunities
          </Link>
        </motion.div>

        <div className="max-w-3xl">
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <span className={`badge border ${locConfig.color}`}>{locConfig.label}</span>
            <span className="badge bg-white/10 text-white/70 border border-white/20">
              {employmentConfig[job.employmentType] || job.employmentType}
            </span>
            {job.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="badge bg-white/5 text-white/50 border border-white/10">
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
          >
            {job.title}
          </motion.h1>

          {/* Company */}
          {job.companyName && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-white/50 font-body text-base mb-8 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-brand-400" />
              {job.companyName}
            </motion.p>
          )}

          {/* Meta chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <div className="flex items-center gap-2 text-white/70 font-body text-sm">
              <MapPin className="w-4 h-4 text-brand-400" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-white/70 font-body text-sm">
              <DollarSign className="w-4 h-4 text-brand-400" />
              {job.salary}
            </div>
            {job.deadline && (
              <div className="flex items-center gap-2 text-white/70 font-body text-sm">
                <Clock className="w-4 h-4 text-accent-400" />
                Deadline: {formatDate(job.deadline)}
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              href="#apply"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-brand-950 bg-white hover:bg-brand-50 transition-all text-base shadow-glow font-body"
            >
              Apply Now — It&apos;s Free
              <span className="text-lg">→</span>
            </motion.a>
            <motion.a
              href="#details"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white/80 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 transition-all text-base font-body"
            >
              See Full Details
            </motion.a>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 sm:grid-cols-3 gap-6 max-w-sm"
        >
          {[
            { value: `${job.applicationCount || 0}+`, label: 'Applied' },
            { value: `${job.viewCount || 0}`, label: 'Views' },
            { value: '48hrs', label: 'Response' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl font-bold text-white">{value}</div>
              <div className="text-white/40 text-xs font-body mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="text-white/30"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </section>
  )
}
