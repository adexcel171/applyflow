'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Zap, LayoutDashboard, Briefcase, Users, LogOut, Plus,
  Eye, EyeOff, Trash2, Edit3, Download, Search, Filter,
  TrendingUp, Activity, CheckCircle2, Clock, XCircle, Star,
  ExternalLink, ChevronDown, X
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import JobFormModal from './JobFormModal'

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
}

interface Application {
  _id: string
  jobId: string
  jobTitle: string
  name: string
  email: string
  phone: string
  instagram?: string
  location: string
  answer: string
  referral?: string
  status: string
  createdAt: string
}

interface Stats {
  totalJobs: number
  activeJobs: number
  totalApps: number
  totalViews: number
}

interface Props {
  initialJobs: Job[]
  recentApps: Application[]
  stats: Stats
  adminEmail: string
}

type Tab = 'overview' | 'jobs' | 'applicants'

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:     { label: 'Pending',     color: 'bg-amber-100 text-amber-700',   icon: Clock },
  reviewing:   { label: 'Reviewing',   color: 'bg-blue-100 text-blue-700',     icon: Activity },
  shortlisted: { label: 'Shortlisted', color: 'bg-purple-100 text-purple-700', icon: Star },
  accepted:    { label: 'Accepted',    color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected:    { label: 'Rejected',    color: 'bg-red-100 text-red-700',       icon: XCircle },
}

export default function AdminDashboardClient({ initialJobs, recentApps, stats, adminEmail }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [applications, setApplications] = useState<Application[]>(recentApps)
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loadingApps, setLoadingApps] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [expandedApp, setExpandedApp] = useState<string | null>(null)

  // ── Logout ────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  // ── Toggle Job Active ─────────────────────────────────────
  const toggleJobActive = async (job: Job) => {
    const toastId = toast.loading('Updating...')
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !job.isActive }),
      })
      if (!res.ok) throw new Error()
      setJobs((prev) => prev.map((j) => j._id === job._id ? { ...j, isActive: !j.isActive } : j))
      toast.success(`Job ${!job.isActive ? 'activated' : 'deactivated'}`, { id: toastId })
    } catch {
      toast.error('Failed to update job', { id: toastId })
    }
  }

  // ── Delete Job ────────────────────────────────────────────
  const deleteJob = async (jobId: string, title: string) => {
    if (!confirm(`Delete "${title}" and all its applications? This cannot be undone.`)) return
    const toastId = toast.loading('Deleting...')
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setJobs((prev) => prev.filter((j) => j._id !== jobId))
      toast.success('Job deleted', { id: toastId })
    } catch {
      toast.error('Failed to delete job', { id: toastId })
    }
  }

  // ── Fetch Applications ────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setLoadingApps(true)
    try {
      const params = new URLSearchParams()
      if (selectedJob !== 'all') params.set('jobId', selectedJob)
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      params.set('limit', '50')

      const res = await fetch(`/api/admin/applications?${params}`)
      const json = await res.json()
      if (json.success) setApplications(json.data)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoadingApps(false)
    }
  }, [selectedJob, statusFilter, search])

  // ── Update Application Status ─────────────────────────────
  const updateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status }),
      })
      if (!res.ok) throw new Error()
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a))
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  // ── Export CSV ────────────────────────────────────────────
  const exportCSV = () => {
    const params = new URLSearchParams()
    if (selectedJob !== 'all') params.set('jobId', selectedJob)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    window.open(`/api/admin/export?${params}`, '_blank')
  }

  // ── Job saved callback ────────────────────────────────────
  const onJobSaved = (job: Job) => {
    if (editingJob) {
      setJobs((prev) => prev.map((j) => j._id === job._id ? job : j))
    } else {
      setJobs((prev) => [job, ...prev])
    }
    setShowJobModal(false)
    setEditingJob(null)
  }

  const statCards = [
    { label: 'Total Jobs',    value: stats.totalJobs,  icon: Briefcase,   color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Jobs',   value: stats.activeJobs, icon: Activity,    color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Applies', value: stats.totalApps,  icon: Users,       color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Views',   value: stats.totalViews, icon: TrendingUp,  color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-surface-100 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-surface-900 leading-none">ApplyFlow</div>
              <div className="text-[10px] text-surface-400 font-body mt-0.5">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {([ 
            { id: 'overview',    label: 'Overview',     icon: LayoutDashboard },
            { id: 'jobs',        label: 'Jobs',          icon: Briefcase },
            { id: 'applicants',  label: 'Applicants',   icon: Users },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id)
                if (id === 'applicants') fetchApplications()
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-body transition-all',
                activeTab === id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-500 hover:text-surface-800 hover:bg-surface-50'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-surface-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold font-body">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-surface-800 font-body truncate">{adminEmail}</div>
              <div className="text-[10px] text-surface-400 font-body">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-surface-500 hover:text-red-600 hover:bg-red-50 font-body transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h1 className="font-display text-3xl font-bold text-surface-900">Dashboard</h1>
                <p className="text-surface-500 font-body mt-1">Welcome back. Here&apos;s your snapshot.</p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
                {statCards.map(({ label, value, icon: Icon, color }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="card p-6"
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-display text-3xl font-bold text-surface-900">{value.toLocaleString()}</div>
                    <div className="text-surface-500 text-sm font-body mt-1">{label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Applications */}
              <div className="card overflow-hidden">
                <div className="p-6 border-b border-surface-100 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-surface-900">Recent Applications</h2>
                  <button
                    onClick={() => { setActiveTab('applicants'); fetchApplications() }}
                    className="text-brand-600 text-sm font-semibold font-body hover:text-brand-700"
                  >
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-surface-100">
                  {recentApps.length === 0 ? (
                    <div className="p-10 text-center text-surface-400 font-body">No applications yet.</div>
                  ) : (
                    recentApps.map((app) => {
                      const cfg = statusConfig[app.status] || statusConfig.pending
                      return (
                        <div key={app._id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-surface-50">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-surface-900 font-body text-sm">{app.name}</div>
                            <div className="text-surface-400 font-body text-xs mt-0.5">{app.email} · {app.jobTitle}</div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={cn('badge', cfg.color)}>{cfg.label}</span>
                            <span className="text-surface-400 text-xs font-body">{formatDate(app.createdAt)}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── JOBS TAB ── */}
          {activeTab === 'jobs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold text-surface-900">Jobs</h1>
                  <p className="text-surface-500 font-body mt-1">{jobs.length} total · {jobs.filter(j => j.isActive).length} active</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEditingJob(null); setShowJobModal(true) }}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4" /> New Job
                </motion.button>
              </div>

              <div className="card overflow-hidden">
                {jobs.length === 0 ? (
                  <div className="p-16 text-center">
                    <Briefcase className="w-12 h-12 text-surface-200 mx-auto mb-4" />
                    <p className="font-display text-xl font-bold text-surface-400">No jobs yet</p>
                    <p className="text-surface-400 font-body text-sm mt-2">Create your first job to get started.</p>
                    <button
                      onClick={() => setShowJobModal(true)}
                      className="btn-primary mt-6 mx-auto"
                    >
                      <Plus className="w-4 h-4" /> Create Job
                    </button>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-100 bg-surface-50">
                        {['Job Title', 'Type', 'Views', 'Applicants', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-surface-400 font-body uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-surface-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-surface-900 font-body text-sm">{job.title}</div>
                            <div className="text-surface-400 font-body text-xs mt-0.5">{job.location}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="badge bg-surface-100 text-surface-600 capitalize">{job.employmentType}</span>
                          </td>
                          <td className="px-5 py-4 text-surface-600 font-body text-sm">{job.viewCount.toLocaleString()}</td>
                          <td className="px-5 py-4 text-surface-600 font-body text-sm font-semibold">{job.applicationCount}</td>
                          <td className="px-5 py-4">
                            <span className={cn('badge', job.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-100 text-surface-500')}>
                              {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <a
                                href={`/jobs/${job.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                                title="View page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => toggleJobActive(job)}
                                className="p-1.5 rounded-lg text-surface-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                title={job.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {job.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => { setEditingJob(job); setShowJobModal(true) }}
                                className="p-1.5 rounded-lg text-surface-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteJob(job._id, job.title)}
                                className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          )}

          {/* ── APPLICANTS TAB ── */}
          {activeTab === 'applicants' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display text-3xl font-bold text-surface-900">Applicants</h1>
                  <p className="text-surface-500 font-body mt-1">{applications.length} results</p>
                </div>
                <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>

              {/* Filters */}
              <div className="card p-4 mb-6 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
                    className="input-field pl-9"
                  />
                </div>
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="all">All Jobs</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>{j.title}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(statusConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
                <button onClick={fetchApplications} className="btn-primary py-2.5 px-5">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              {/* Applications table */}
              <div className="card overflow-hidden">
                {loadingApps ? (
                  <div className="p-10 text-center text-surface-400 font-body">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="p-16 text-center">
                    <Users className="w-12 h-12 text-surface-200 mx-auto mb-4" />
                    <p className="font-display text-xl font-bold text-surface-400">No applications found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-surface-100">
                    {applications.map((app) => {
                      const cfg = statusConfig[app.status] || statusConfig.pending
                      const StatusIcon = cfg.icon
                      const isExpanded = expandedApp === app._id

                      return (
                        <div key={app._id} className="hover:bg-surface-50 transition-colors">
                          <div
                            className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                            onClick={() => setExpandedApp(isExpanded ? null : app._id)}
                          >
                            {/* Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold font-body flex-shrink-0">
                              {app.name.charAt(0)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-surface-900 font-body text-sm">{app.name}</div>
                              <div className="text-surface-400 font-body text-xs mt-0.5 truncate">
                                {app.email} · {app.jobTitle}
                              </div>
                            </div>

                            {/* Status + Date */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={cn('badge flex items-center gap-1', cfg.color)}>
                                <StatusIcon className="w-3 h-3" />{cfg.label}
                              </span>
                              <span className="text-surface-400 text-xs font-body hidden sm:block">
                                {formatDate(app.createdAt)}
                              </span>
                              <ChevronDown className={cn('w-4 h-4 text-surface-400 transition-transform', isExpanded && 'rotate-180')} />
                            </div>
                          </div>

                          {/* Expanded detail */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-5 pt-1 bg-surface-50 border-t border-surface-100">
                                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                    {[
                                      { label: 'Phone', value: app.phone },
                                      { label: 'Instagram', value: app.instagram || '—' },
                                      { label: 'Location', value: app.location },
                                      { label: 'Referral', value: app.referral || '—' },
                                    ].map(({ label, value }) => (
                                      <div key={label}>
                                        <div className="text-xs text-surface-400 font-body mb-0.5">{label}</div>
                                        <div className="text-sm text-surface-700 font-body font-medium">{value}</div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mb-4">
                                    <div className="text-xs text-surface-400 font-body mb-1">Answer</div>
                                    <p className="text-sm text-surface-700 font-body leading-relaxed bg-white rounded-xl p-3 border border-surface-200">
                                      {app.answer}
                                    </p>
                                  </div>

                                  {/* Status actions */}
                                  <div className="flex flex-wrap gap-2">
                                    <span className="text-xs text-surface-400 font-body self-center mr-1">Update status:</span>
                                    {Object.entries(statusConfig).map(([key, val]) => (
                                      <button
                                        key={key}
                                        onClick={() => updateStatus(app._id, key)}
                                        className={cn(
                                          'badge cursor-pointer transition-all border',
                                          app.status === key
                                            ? val.color + ' border-current'
                                            : 'bg-white text-surface-500 border-surface-200 hover:border-surface-400'
                                        )}
                                      >
                                        {val.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Job Form Modal */}
      <AnimatePresence>
        {showJobModal && (
          <JobFormModal
            job={editingJob}
            onSave={onJobSaved}
            onClose={() => { setShowJobModal(false); setEditingJob(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
