import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/db'
import Job from '@/models/Job'
import { getAdminFromCookies } from '@/lib/auth'

const JobSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().min(10),
  shortDescription: z.string().min(10).max(300),
  location: z.string().min(2),
  locationType: z.enum(['remote', 'onsite', 'hybrid']).default('remote'),
  salary: z.string().min(1),
  employmentType: z
    .enum(['full-time', 'part-time', 'contract', 'internship', 'scholarship'])
    .default('full-time'),
  benefits: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  heroImage: z.string().optional(),
  companyName: z.string().optional(),
  testimonials: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        avatar: z.string().optional(),
        text: z.string(),
        rating: z.number().min(1).max(5).default(5),
      })
    )
    .default([]),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .default([]),
  whatsappPhone: z.string().optional(),
  deadline: z.string().optional(),
})

// GET /api/jobs — list all jobs (public: active only; admin: all)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const admin = getAdminFromCookies()
    const { searchParams } = new URL(request.url)
    const showAll = admin && searchParams.get('all') === 'true'

    const query = showAll ? {} : { isActive: true }
    const jobs = await Job.find(query)
      .select('-testimonials -faqs -__v')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ success: true, data: jobs })
  } catch (error) {
    console.error('[GET /api/jobs]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST /api/jobs — create job (admin only)
export async function POST(request: NextRequest) {
  const admin = getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
  }

  const result = JobSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    const existing = await Job.findOne({ slug: result.data.slug })
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A job with this slug already exists' },
        { status: 409 }
      )
    }

    const job = await Job.create(result.data)
    return NextResponse.json({ success: true, data: job }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/jobs]', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    )
  }
}
