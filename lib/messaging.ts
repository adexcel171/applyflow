// ============================================================
// Messaging Integration: Resend (Email) + Twilio (SMS/WhatsApp)
// ============================================================

interface MessagePayload {
  name: string
  email: string
  phone: string
  jobTitle: string
  jobSlug: string
}

// ─── Email via Resend ────────────────────────────────────────
export async function sendConfirmationEmail(payload: MessagePayload): Promise<void> {
  const { name, email, jobTitle, jobSlug } = payload

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://applyflow.com'

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f5; margin: 0; padding: 0; }
        .wrapper { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0c93ea, #015da2); padding: 40px 32px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 15px; }
        .body { padding: 40px 32px; }
        .body h2 { color: #0f0f1a; font-size: 22px; margin: 0 0 16px; }
        .body p { color: #52525b; line-height: 1.7; margin: 0 0 20px; font-size: 15px; }
        .steps { background: #f0f7ff; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .steps h3 { color: #0c93ea; margin: 0 0 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .step { display: flex; align-items: flex-start; margin-bottom: 12px; }
        .step-num { background: #0c93ea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-right: 12px; flex-shrink: 0; }
        .cta { display: inline-block; background: linear-gradient(135deg, #0c93ea, #015da2); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 8px 0 24px; }
        .footer { background: #f4f4f5; padding: 24px 32px; text-align: center; }
        .footer p { color: #a1a1aa; font-size: 13px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>✅ Application Received!</h1>
          <p>ApplyFlow — Opportunity Platform</p>
        </div>
        <div class="body">
          <h2>Hey ${name}, you're in! 🎉</h2>
          <p>We've successfully received your application for <strong>${jobTitle}</strong>. Our team is reviewing submissions and will be in touch shortly.</p>
          
          <div class="steps">
            <h3>What happens next</h3>
            <div class="step">
              <span class="step-num">1</span>
              <p style="margin:0;color:#374151;font-size:14px;">Our team reviews your application within <strong>2–3 business days</strong></p>
            </div>
            <div class="step">
              <span class="step-num">2</span>
              <p style="margin:0;color:#374151;font-size:14px;">Shortlisted candidates receive a <strong>screening call invitation</strong></p>
            </div>
            <div class="step">
              <span class="step-num">3</span>
              <p style="margin:0;color:#374151;font-size:14px;">Final candidates get onboarded to the program 🚀</p>
            </div>
          </div>

          <p>In the meantime, feel free to revisit the opportunity page:</p>
          <a class="cta" href="${appUrl}/jobs/${jobSlug}">View Opportunity →</a>

          <p style="font-size:13px;color:#a1a1aa;">Questions? Reply to this email or DM us on Instagram.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ApplyFlow. All rights reserved.</p>
          <p style="margin-top:4px;">You received this because you applied on ApplyFlow.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'ApplyFlow <noreply@applyflow.com>',
      to: email,
      subject: `✅ Application Confirmed — ${jobTitle}`,
      html: htmlBody,
    })

    console.log(`[Email] Confirmation sent to ${email}`)
  } catch (error) {
    console.error('[Email] Failed to send confirmation:', error)
  }
}

// ─── SMS via Twilio ──────────────────────────────────────────
export async function sendConfirmationSMS(payload: MessagePayload): Promise<void> {
  const { name, phone, jobTitle } = payload

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('Twilio credentials not set — skipping SMS')
    return
  }

  const message = `Hi ${name}! ✅ Your application for "${jobTitle}" on ApplyFlow has been received. We'll review and get back to you within 2-3 days. Good luck! 🚀`

  try {
    const twilio = (await import('twilio')).default
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    })

    console.log(`[SMS] Confirmation sent to ${phone}`)
  } catch (error) {
    console.error('[SMS] Failed to send confirmation:', error)
  }
}

// ─── WhatsApp via Twilio ─────────────────────────────────────
export async function sendWhatsAppConfirmation(payload: MessagePayload): Promise<void> {
  const { name, phone, jobTitle, jobSlug } = payload

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.warn('WhatsApp config not set — skipping WhatsApp')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://applyflow.com'

  const message = `👋 Hi *${name}*!

Your application for *${jobTitle}* has been received! 🎉

*What's next:*
1️⃣ Our team reviews in 2–3 days
2️⃣ Shortlisted candidates get a call
3️⃣ Finals get onboarded 🚀

View your opportunity: ${appUrl}/jobs/${jobSlug}

_ApplyFlow — Opportunity Platform_`

  try {
    const twilio = (await import('twilio')).default
    const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER!,
      to: `whatsapp:${phone}`,
    })

    console.log(`[WhatsApp] Confirmation sent to ${phone}`)
  } catch (error) {
    console.error('[WhatsApp] Failed:', error)
  }
}

// ─── Send All Notifications ──────────────────────────────────
export async function sendAllNotifications(payload: MessagePayload): Promise<void> {
  await Promise.allSettled([
    sendConfirmationEmail(payload),
    sendConfirmationSMS(payload),
    sendWhatsAppConfirmation(payload),
  ])
}
