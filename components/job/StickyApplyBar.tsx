'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

interface Props {
  jobTitle: string
}

export default function StickyApplyBar({ jobTitle }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-surface-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-surface-900 text-sm truncate">
                {jobTitle}
              </span>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <p className="text-surface-500 text-xs font-body hidden md:block">
                ⚡ Applications close soon
              </p>
              <motion.a
                href="#apply"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary py-2.5 px-6 text-sm"
              >
                Apply Now →
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
