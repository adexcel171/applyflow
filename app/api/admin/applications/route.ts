import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Application from '@/models/Application'
import { getAdminFromCookies } from '@/lib/auth'

// GET /api/admin/applications?jobId=&status=&page=&limit=
export async function GET(request: NextRequest) {
  const admin = getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''

  try {
    await connectDB()

    // Build query
    const query: Record<string, unknown> = {}
    if (jobId) query.jobId = jobId
    if (status) query.status = status
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ]
    }

    const total = await Application.countDocuments(query)
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[GET /api/admin/applications]', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/admin/applications — update status
export async function PATCH(request: NextRequest) {
  const admin = getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  let body: { id: string; status: string; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid body' }, { status: 400 })
  }

  try {
    await connectDB()
    const app = await Application.findByIdAndUpdate(
      body.id,
      { status: body.status, notes: body.notes },
      { new: true }
    )
    if (!app) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: app })
  } catch (error) {
    console.error('[PATCH /api/admin/applications]', error)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
