import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Job from '@/models/Job'
import Application from '@/models/Application'
import { getAdminFromCookies } from '@/lib/auth'

// GET /api/jobs/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const job = await Job.findById(params.id).lean()
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    console.error('[GET /api/jobs/:id]', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

// PUT /api/jobs/[id] — update job (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  try {
    await connectDB()
    const job = await Job.findByIdAndUpdate(
      params.id,
      { $set: body as object },
      { new: true, runValidators: true }
    )
    if (!job) {
      return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: job })
  } catch (error) {
    console.error('[PUT /api/jobs/:id]', error)
    return NextResponse.json({ success: false, message: 'Failed to update job' }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    await Job.findByIdAndDelete(params.id)
    // Cascade delete applications
    await Application.deleteMany({ jobId: params.id })
    return NextResponse.json({ success: true, message: 'Job and applications deleted' })
  } catch (error) {
    console.error('[DELETE /api/jobs/:id]', error)
    return NextResponse.json({ success: false, message: 'Failed to delete job' }, { status: 500 })
  }
}
