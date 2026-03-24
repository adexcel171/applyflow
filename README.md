# ⚡ ApplyFlow

**A high-converting job application funnel platform.**  
Built with Next.js 14 (App Router), MongoDB + Mongoose, Tailwind CSS, and Framer Motion.

> ApplyFlow is NOT a job board — it's a landing-page-based **lead generation system** where each opportunity has its own conversion-optimized page.

---

## ✨ Features

### Public
- 🎯 **Per-job landing pages** (`/jobs/[slug]`) — hero, details, testimonials, FAQ, sticky CTA
- 📝 **Application form** — full validation, loading/success/error states
- 🔔 **Instant notifications** — Email (Resend) + WhatsApp + SMS (Twilio) on submission
- 💬 **WhatsApp deep-link button** — floating apply button
- 🚦 **Rate limiting** — 5 submissions per IP per 15 minutes
- 🔁 **Duplicate prevention** — per email AND per phone, per job
- 📊 **View tracking** — counts page views per opportunity
- 📱 **Mobile-first, responsive** — full experience on all screen sizes
- 🎞️ **Framer Motion animations** — scroll reveals, hover effects, success confetti

### Admin (`/admin`)
- 🔐 **JWT-based authentication** — secure cookie session
- 📋 **Jobs CRUD** — create, edit, toggle active/inactive, delete
- 👥 **Applicant viewer** — paginated table with search, job filter, status filter
- 🔄 **Status management** — pending → reviewing → shortlisted → accepted/rejected
- 📥 **CSV export** — download filtered applicants as CSV
- 📈 **Overview dashboard** — stats cards + recent applications

### Technical
- ⚡ **App Router** — server components, streaming, ISR
- 🍃 **Mongoose** — type-safe models with compound unique indexes
- 🎨 **Custom design system** — Playfair Display + DM Sans, brand color palette
- 🔒 **Security** — httpOnly cookies, server-side auth guards, input sanitization
- 🚀 **SEO** — per-job metadata, OpenGraph tags, sitemap-ready

---

## 🗂️ Project Structure

```
applyflow/
├── app/
│   ├── layout.tsx              # Root layout (fonts, Toaster)
│   ├── globals.css             # Tailwind + custom utilities
│   ├── page.tsx                # Home — lists active jobs
│   ├── not-found.tsx           # Custom 404
│   ├── jobs/[slug]/
│   │   └── page.tsx            # Dynamic job landing page
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard (server, auth-guarded)
│   │   └── login/page.tsx      # Login page
│   └── api/
│       ├── apply/route.ts      # POST — submit application
│       ├── auth/route.ts       # GET/POST/DELETE — admin auth
│       ├── jobs/
│       │   ├── route.ts        # GET all / POST create
│       │   ├── [id]/route.ts   # GET / PUT / DELETE by ID
│       │   └── [id]/view/route.ts  # POST — increment view count
│       └── admin/
│           ├── applications/route.ts  # GET list / PATCH status
│           └── export/route.ts        # GET CSV export
│
├── components/
│   ├── job/
│   │   ├── JobHero.tsx         # Hero section w/ animations
│   │   ├── JobDetails.tsx      # Requirements, benefits, sidebar
│   │   ├── TestimonialsSection.tsx
│   │   ├── FAQSection.tsx      # Accordion FAQ
│   │   ├── StickyApplyBar.tsx  # Appears on scroll
│   │   └── WhatsAppButton.tsx  # Floating WhatsApp CTA
│   ├── forms/
│   │   └── ApplicationForm.tsx # Full form w/ RHF + Zod
│   └── admin/
│       ├── AdminLoginClient.tsx
│       ├── AdminDashboardClient.tsx  # Full dashboard UI
│       └── JobFormModal.tsx         # Create/edit job modal
│
├── models/
│   ├── Job.ts                  # Mongoose Job model
│   └── Application.ts          # Mongoose Application model
│
├── lib/
│   ├── db.ts                   # MongoDB connection (cached)
│   ├── auth.ts                 # JWT sign/verify/cookie helpers
│   ├── messaging.ts            # Resend email + Twilio SMS/WhatsApp
│   ├── rateLimit.ts            # In-memory rate limiter
│   └── utils.ts                # cn, formatDate, slugify, etc.
│
└── scripts/
    └── seed.js                 # Database seeder (3 sample jobs)
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/applyflow.git
cd applyflow
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/applyflow
JWT_SECRET=your-super-secret-min-32-char-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password

# For email notifications (get at resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# For SMS + WhatsApp (get at twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** Email/SMS keys are optional — the app works without them. Notifications simply won't send.

### 3. Seed the Database (optional)

Seed 3 beautiful sample jobs to explore the UI:

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Home:** http://localhost:3000
- **Sample job:** http://localhost:3000/jobs/senior-growth-marketing-manager
- **Admin:** http://localhost:3000/admin

---

## 🔐 Admin Access

1. Go to `/admin` — you'll be redirected to `/admin/login`
2. Enter the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env.local`
3. You'll land on the dashboard with full access

**Default dev credentials** (set in `.env.local`):
```
Email: admin@applyflow.com
Password: (whatever you set as ADMIN_PASSWORD)
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `next@14` | App Router, server components, ISR |
| `mongoose` | MongoDB ODM with TypeScript support |
| `framer-motion` | Page animations, scroll reveals, transitions |
| `react-hook-form` | Performant form state management |
| `zod` | Schema validation (client + server) |
| `@hookform/resolvers` | RHF + Zod integration |
| `jsonwebtoken` | JWT signing for admin sessions |
| `bcryptjs` | Admin password hashing |
| `resend` | Transactional email sending |
| `twilio` | SMS + WhatsApp notifications |
| `rate-limiter-flexible` | In-memory rate limiting |
| `lucide-react` | Icon library |
| `react-hot-toast` | Toast notifications |
| `clsx` + `tailwind-merge` | Conditional classname utility |

---

## 🌐 Deployment (Vercel)

```bash
npm run build
```

Then deploy to Vercel:

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add all environment variables from `.env.example`
4. Deploy — Vercel handles the rest

> **MongoDB:** Use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier. Make sure to whitelist Vercel's IPs or use `0.0.0.0/0` for the IP access list.

---

## 📨 Messaging Setup

### Email (Resend)
1. Sign up at [resend.com](https://resend.com)
2. Add and verify your domain
3. Create an API key
4. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL`

### WhatsApp + SMS (Twilio)
1. Sign up at [twilio.com](https://twilio.com)
2. Get a phone number
3. For WhatsApp: Join the Twilio Sandbox (`whatsapp:+14155238886`)
4. Set all `TWILIO_*` env vars

---

## 🔧 Customization

### Adding a New Job via Admin UI
1. Go to `/admin` → **Jobs** tab
2. Click **New Job**
3. Fill in the form — slug auto-generates from the title
4. Toggle **Active** and save

### Adding a New Job via Seed Script
Edit `scripts/seed.js` and add to the `sampleJobs` array, then run `npm run seed`.

### Changing the Color Scheme
Edit `tailwind.config.js` → `theme.extend.colors.brand` to swap the primary palette.

### Securing Admin Password with bcrypt
```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('your-password',12))"
```
Paste the hash as your `ADMIN_PASSWORD` env variable.

---

## 📊 Database Collections

### `jobs`
```typescript
{
  title, slug, description, shortDescription,
  location, locationType, salary, employmentType,
  benefits[], requirements[], responsibilities[],
  isActive, viewCount, applicationCount,
  tags[], companyName, whatsappPhone,
  testimonials[{ name, role, avatar, text, rating }],
  faqs[{ question, answer }],
  deadline, createdAt, updatedAt
}
```

### `applications`
```typescript
{
  jobId (ref: Job), jobTitle, jobSlug,
  name, phone, email, instagram, location,
  answer, referral,
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted',
  notes, ipAddress, userAgent,
  createdAt, updatedAt
}
```

**Unique indexes:**
- `{ jobId, email }` — one application per email per job
- `{ jobId, phone }` — one application per phone per job

---

## 🛡️ Security

- Admin token stored in `httpOnly`, `sameSite: lax` cookie — never exposed to JS
- All admin API routes verify JWT on every request
- Rate limiting: 5 form submissions per IP per 15 minutes
- Duplicate submission prevention at DB level (compound unique index)
- Input validation with Zod on both client and server
- Server-side auth guard — unauthenticated requests get 401 before touching DB

---

## 📄 License

MIT © ApplyFlow
