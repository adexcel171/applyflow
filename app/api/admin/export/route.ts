import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Application from '@/models/Application'
import { getAdminFromCookies } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const admin = getAdminFromCookies()
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  const status = searchParams.get('status')

  try {
    await connectDB()

    const query: Record<string, unknown> = {}
    if (jobId) query.jobId = jobId
    if (status) query.status = status

    const applications = await Application.find(query).sort({ createdAt: -1 }).lean()

    // Build CSV manually for zero dependencies on server
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Instagram',
      'Location',
      'Job Title',
      'Status',
      'Referral',
      'Answer',
      'Applied At',
    ]

    const escape = (val: unknown): string => {
      const str = val == null ? '' : String(val)
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }

    const rows = applications.map((a) => [
      escape(a.name),
      escape(a.email),
      escape(a.phone),
      escape(a.instagram || ''),
      escape(a.location),
      escape(a.jobTitle),
      escape(a.status),
      escape(a.referral || ''),
      escape(a.answer),
      escape(new Date(a.createdAt).toISOString()),
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const filename = `applications-${jobId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('[GET /api/admin/export]', error)
    return NextResponse.json({ success: false, message: 'Export failed' }, { status: 500 })
  }
}
