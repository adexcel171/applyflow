'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2, Loader2, Zap } from 'lucide-react'
import { cn, slugify } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Job {
  _id: string
  title: string
  slug: string
  location: string
  locationType: string
  salary: string
  employmentType: string
  isActive: boolean
  viewCount: number
  applicationCount: number
  createdAt: string
  shortDescription?: string
  description?: string
  benefits?: string[]
  requirements?: string[]
  responsibilities?: string[]
  tags?: string[]
  companyName?: string
  whatsappPhone?: string
  testimonials?: { name: string; role: string; text: string; rating: number }[]
  faqs?: { question: string; answer: string }[]
}

interface Props {
  job: Job | null
  onSave: (job: Job) => void
  onClose: () => void
}

type ArrayField = 'benefits' | 'requirements' | 'responsibilities' | 'tags'

export default function JobFormModal({ job, onSave, onClose }: Props) {
  const isEdit = !!job

  const [form, setForm] = useState({
    title: job?.title || '',
    slug: job?.slug || '',
    shortDescription: job?.shortDescription || '',
    description: job?.description || '',
    location: job?.location || '',
    locationType: job?.locationType || 'remote',
    salary: job?.salary || '',
    employmentType: job?.employmentType || 'full-time',
    companyName: job?.companyName || 'ApplyFlow',
    isActive: job?.isActive ?? true,
    whatsappPhone: job?.whatsappPhone || '',
    benefits: job?.benefits || [''],
    requirements: job?.requirements || [''],
    responsibilities: job?.responsibilities || [''],
    tags: job?.tags || [''],
    testimonials: job?.testimonials || [],
    faqs: job?.faqs || [],
  })

  const [loading, setLoading] = useState(false)

  const setField = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const autoSlug = (title: string) => {
    if (!isEdit) setField('slug', slugify(title))
  }

  // Array field helpers
  const updateArrayItem = (field: ArrayField, index: number, value: string) => {
    const arr = [...(form[field] as string[])]
    arr[index] = value
    setField(field, arr)
  }

  const addArrayItem = (field: ArrayField) => {
    setField(field, [...(form[field] as string[]), ''])
  }

  const removeArrayItem = (field: ArrayField, index: number) => {
    const arr = (form[field] as string[]).filter((_, i) => i !== index)
    setField(field, arr.length ? arr : [''])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...form,
      benefits: form.benefits.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      responsibilities: form.responsibilities.filter(Boolean),
      tags: form.tags.filter(Boolean),
    }

    try {
      const res = await fetch(isEdit ? `/api/jobs/${job._id}` : '/api/jobs', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok) {
        const errMsg = json.errors
          ? Object.values(json.errors).flat().join(', ')
          : json.message || 'Failed to save job'
        toast.error(errMsg)
        return
      }

      toast.success(isEdit ? 'Job updated!' : 'Job created!')
      onSave(json.data)
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'input-field'
  const labelClass = 'label'

  const ArrayFieldEditor = ({
    field,
    label,
    placeholder,
  }: {
    field: ArrayField
    label: string
    placeholder: string
  }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {(form[field] as string[]).map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateArrayItem(field, i, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeArrayItem(field, i)}
              className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="flex items-center gap-1.5 text-brand-600 text-sm font-semibold font-body hover:text-brand-700 mt-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add {label.slice(0, -1)}
        </button>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <h2 className="font-display text-2xl font-bold text-surface-900">
              {isEdit ? 'Edit Job' : 'Create New Job'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {/* Basic Info */}
          <section>
            <h3 className="font-display text-lg font-bold text-surface-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Job Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => { setField('title', e.target.value); autoSlug(e.target.value) }}
                    required
                    placeholder="e.g. Senior Brand Strategist"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    required
                    placeholder="e.g. senior-brand-strategist"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Short Description * (shown on listing cards)</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setField('shortDescription', e.target.value)}
                  required
                  placeholder="One-line hook for the listing card..."
                  maxLength={300}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Full Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  required
                  rows={5}
                  placeholder="Detailed description of the opportunity..."
                  className={cn(inputClass, 'resize-none')}
                />
              </div>
            </div>
          </section>

          {/* Details */}
          <section>
            <h3 className="font-display text-lg font-bold text-surface-800 mb-4">Job Details</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setField('location', e.target.value)}
                  required
                  placeholder="e.g. New York, NY"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Location Type</label>
                <select value={form.locationType} onChange={(e) => setField('locationType', e.target.value)} className={inputClass}>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Employment Type</label>
                <select value={form.employmentType} onChange={(e) => setField('employmentType', e.target.value)} className={inputClass}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="scholarship">Scholarship</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Compensation *</label>
                <input
                  type="text"
                  value={form.salary}
                  onChange={(e) => setField('salary', e.target.value)}
                  required
                  placeholder="e.g. $80k–$120k/yr or Paid"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setField('companyName', e.target.value)}
                  placeholder="ApplyFlow"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number</label>
                <input
                  type="text"
                  value={form.whatsappPhone}
                  onChange={(e) => setField('whatsappPhone', e.target.value)}
                  placeholder="+1234567890"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setField('isActive', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-11 h-6 rounded-full transition-colors',
                    form.isActive ? 'bg-brand-600' : 'bg-surface-200'
                  )}>
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform',
                      form.isActive ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </div>
                </div>
                <span className="font-semibold text-surface-700 font-body text-sm">
                  {form.isActive ? 'Active — accepting applications' : 'Inactive — hidden from listings'}
                </span>
              </label>
            </div>
          </section>

          {/* Lists */}
          <section className="space-y-6">
            <h3 className="font-display text-lg font-bold text-surface-800">Content</h3>
            <ArrayFieldEditor field="responsibilities" label="Responsibilities" placeholder="What they'll do..." />
            <ArrayFieldEditor field="requirements" label="Requirements" placeholder="What you're looking for..." />
            <ArrayFieldEditor field="benefits" label="Benefits" placeholder="e.g. Health insurance, remote work..." />
            <ArrayFieldEditor field="tags" label="Tags" placeholder="e.g. Marketing, Growth..." />
          </section>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-100">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-primary"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <>{isEdit ? 'Update Job' : 'Create Job'} →</>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
