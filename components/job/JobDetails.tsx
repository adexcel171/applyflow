'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, Briefcase, Star, Gift } from 'lucide-react'
import { IJob } from '@/models/Job'

interface Props {
  job: IJob
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionCard({
  icon: Icon,
  iconColor,
  title,
  items,
  delay,
}: {
  icon: React.ElementType
  iconColor: string
  title: string
  items: string[]
  delay?: number
}) {
  return (
    <FadeInSection delay={delay}>
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold text-surface-900">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.2, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-start gap-3 text-surface-600 font-body text-[15px] leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-500 flex-shrink-0" />
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </FadeInSection>
  )
}

export default function JobDetails({ job }: Props) {
  return (
    <section id="details" className="py-20 bg-surface-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <FadeInSection>
              <div className="card p-8">
                <h2 className="font-display text-3xl font-bold text-surface-900 mb-5">
                  About This Opportunity
                </h2>
                <div
                  className="prose prose-lg max-w-none text-surface-600 font-body leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: job.description.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>'),
                  }}
                />
              </div>
            </FadeInSection>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <SectionCard
                icon={Briefcase}
                iconColor="bg-brand-600"
                title="What You'll Do"
                items={job.responsibilities}
                delay={0.1}
              />
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <SectionCard
                icon={Star}
                iconColor="bg-accent-500"
                title="What We're Looking For"
                items={job.requirements}
                delay={0.2}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <FadeInSection delay={0.15}>
              <div className="card p-6">
                <h3 className="font-display text-xl font-bold text-surface-900 mb-5">Quick Facts</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Location', value: job.location },
                    { label: 'Type', value: job.locationType },
                    { label: 'Compensation', value: job.salary },
                    { label: 'Employment', value: job.employmentType },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-surface-100 last:border-0">
                      <span className="text-sm text-surface-400 font-body">{label}</span>
                      <span className="text-sm font-semibold text-surface-700 font-body capitalize">{value}</span>
                    </div>
                  ))}
                </div>

                <motion.a
                  href="#apply"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full mt-6 text-center justify-center"
                >
                  Apply Now →
                </motion.a>
              </div>
            </FadeInSection>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <FadeInSection delay={0.25}>
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Gift className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-display text-xl font-bold text-surface-900">Benefits</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {job.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-surface-600 font-body">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInSection>
            )}

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <FadeInSection delay={0.3}>
                <div className="card p-6">
                  <h3 className="font-display text-base font-bold text-surface-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="badge bg-brand-50 text-brand-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
