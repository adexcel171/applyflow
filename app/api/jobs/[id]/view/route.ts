import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Job from '@/models/Job'
import { checkViewRateLimit } from '@/lib/rateLimit'
import { getClientIP } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ip = getClientIP(request)
  const allowed = await checkViewRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ success: false }, { status: 429 })
  }

  try {
    await connectDB()
    await Job.findByIdAndUpdate(params.id, { $inc: { viewCount: 1 } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
