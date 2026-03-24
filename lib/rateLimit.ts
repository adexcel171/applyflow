import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

// 5 submissions per IP per 15 minutes
const submitLimiter = new RateLimiterMemory({
  keyPrefix: 'apply_submit',
  points: 5,
  duration: 60 * 15,
})

// 30 page views per IP per minute (analytics)
const viewLimiter = new RateLimiterMemory({
  keyPrefix: 'page_view',
  points: 30,
  duration: 60,
})

export async function checkSubmitRateLimit(ip: string): Promise<{
  allowed: boolean
  remaining?: number
  retryAfter?: number
}> {
  try {
    const result = await submitLimiter.consume(ip)
    return { allowed: true, remaining: result.remainingPoints }
  } catch (e) {
    if (e instanceof RateLimiterRes) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil(e.msBeforeNext / 1000),
      }
    }
    throw e
  }
}

export async function checkViewRateLimit(ip: string): Promise<boolean> {
  try {
    await viewLimiter.consume(ip)
    return true
  } catch {
    return false
  }
}
