'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  avatar?: string
  text: string
  rating: number
}

interface Props {
  testimonials: Testimonial[]
}

export default function TestimonialsSection({ testimonials }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 font-body">
            Social Proof
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-surface-900">
            Hear From Our Alumni
          </h2>
          <p className="text-surface-500 mt-3 font-body text-lg max-w-xl mx-auto">
            Real people, real outcomes. Here&apos;s what they have to say.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="card p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="w-4 h-4"
                    fill={s < t.rating ? '#f97316' : 'transparent'}
                    stroke={s < t.rating ? '#f97316' : '#d1d5db'}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-surface-600 font-body text-[15px] leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm font-body">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-surface-900 text-sm font-body">{t.name}</div>
                  <div className="text-surface-400 text-xs font-body">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
