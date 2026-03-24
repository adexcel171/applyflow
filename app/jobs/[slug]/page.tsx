import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db'
import Job, { IJob } from '@/models/Job'
import JobHero from '@/components/job/JobHero'
import JobDetails from '@/components/job/JobDetails'
import ApplicationForm from '@/components/forms/ApplicationForm'
import TestimonialsSection from '@/components/job/TestimonialsSection'
import FAQSection from '@/components/job/FAQSection'
import StickyApplyBar from '@/components/job/StickyApplyBar'
import WhatsAppButton from '@/components/job/WhatsAppButton'

interface Props {
  params: { slug: string }
}

export const revalidate = 30

async function getJob(slug: string): Promise<IJob | null> {
  try {
    await connectDB()
    const job = await Job.findOne({ slug, isActive: true }).lean()
    if (!job) return null
    return JSON.parse(JSON.stringify(job)) as IJob
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.slug)
  if (!job) return { title: 'Opportunity Not Found' }

  return {
    title: `${job.title} — Apply on ApplyFlow`,
    description: job.shortDescription,
    openGraph: {
      title: `${job.title} — Apply on ApplyFlow`,
      description: job.shortDescription,
      images: job.heroImage ? [job.heroImage] : [],
    },
  }
}

export default async function JobPage({ params }: Props) {
  const job = await getJob(params.slug)
  if (!job) notFound()

  return (
    <div className="min-h-screen bg-white">
      <JobHero job={job} />
      <JobDetails job={job} />

      {/* Application Form Section */}
      <section id="apply" className="py-20 bg-gradient-to-b from-brand-950 via-surface-900 to-brand-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white mb-5">
              ✦ Quick 2-minute application
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Ready to Apply?
            </h2>
            <p className="text-white/60 font-body text-lg">
              Fill out the form below and we&apos;ll be in touch within 2–3 business days.
            </p>
          </div>
          <ApplicationForm job={{ _id: String(job._id), title: job.title, slug: job.slug }} />
        </div>
      </section>

      {job.testimonials && job.testimonials.length > 0 && (
        <TestimonialsSection testimonials={job.testimonials} />
      )}

      {job.faqs && job.faqs.length > 0 && (
        <FAQSection faqs={job.faqs} />
      )}

      <StickyApplyBar jobTitle={job.title} />

      {job.whatsappPhone && (
        <WhatsAppButton
          phone={job.whatsappPhone}
          message={`Hi! I'm interested in the ${job.title} opportunity on ApplyFlow.`}
        />
      )}
    </div>
  )
}
