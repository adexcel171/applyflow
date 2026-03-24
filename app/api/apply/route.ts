import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/db'
import Application from '@/models/Application'
import Job from '@/models/Job'
import { sendAllNotifications } from '@/lib/messaging'
import { checkSubmitRateLimit, checkViewRateLimit } from '@/lib/rateLimit'
import { getClientIP } from '@/lib/utils'

const ApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  jobSlug: z.string().min(1),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  instagram: z.string().optional(),
  location: z.string().min(2, 'Location is required').max(100),
  answer: z.string().min(20, 'Answer must be at least 20 characters').max(2000),
  referral: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)

  // Rate limiting
  const rateCheck = await checkSubmitRateLimit(ip)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many submissions. Please try again in ${rateCheck.retryAfter} seconds.`,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(rateCheck.retryAfter) },
      }
    )
  }

  // Parse body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Validate
  const result = ApplicationSchema.safeParse(body)
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

  const data = result.data

  try {
    await connectDB()

    // Verify job exists and is active
    const job = await Job.findById(data.jobId)
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Opportunity not found' },
        { status: 404 }
      )
    }
    if (!job.isActive) {
      return NextResponse.json(
        { success: false, message: 'This opportunity is no longer accepting applications' },
        { status: 400 }
      )
    }

    // Check for duplicate (email per job)
    const existingByEmail = await Application.findOne({
      jobId: data.jobId,
      email: data.email.toLowerCase(),
    })
    if (existingByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already applied for this opportunity with this email address.',
        },
        { status: 409 }
      )
    }

    // Check for duplicate (phone per job)
    const existingByPhone = await Application.findOne({
      jobId: data.jobId,
      phone: data.phone,
    })
    if (existingByPhone) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already applied for this opportunity with this phone number.',
        },
        { status: 409 }
      )
    }

    // Save application
    const application = await Application.create({
      jobId: data.jobId,
      jobTitle: job.title,
      jobSlug: job.slug,
      name: data.name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      instagram: data.instagram,
      location: data.location,
      answer: data.answer,
      referral: data.referral,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Increment application count on job
    await Job.findByIdAndUpdate(data.jobId, { $inc: { applicationCount: 1 } })

    // Fire notifications (non-blocking)
    sendAllNotifications({
      name: data.name,
      email: data.email,
      phone: data.phone,
      jobTitle: job.title,
      jobSlug: job.slug,
    }).catch(console.error)

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully! Check your email for confirmation.',
        applicationId: application._id.toString(),
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    // Handle MongoDB duplicate key error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already applied for this opportunity.',
        },
        { status: 409 }
      )
    }

    console.error('[POST /api/apply]', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
