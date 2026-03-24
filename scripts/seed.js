// scripts/seed.js
// Run with: node scripts/seed.js
// Requires MONGODB_URI in .env.local

require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env.local')
  process.exit(1)
}

// ─── Inline schemas (avoid TS import) ──────────────────────
const JobSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    shortDescription: String,
    location: String,
    locationType: { type: String, default: 'remote' },
    salary: String,
    employmentType: { type: String, default: 'full-time' },
    benefits: [String],
    requirements: [String],
    responsibilities: [String],
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
    tags: [String],
    companyName: String,
    whatsappPhone: String,
    testimonials: [{ name: String, role: String, avatar: String, text: String, rating: Number }],
    faqs: [{ question: String, answer: String }],
  },
  { timestamps: true }
)

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema)

const sampleJobs = [
  {
    title: 'Senior Growth Marketing Manager',
    slug: 'senior-growth-marketing-manager',
    shortDescription: 'Lead growth strategy for a fast-scaling DTC brand doing $20M+ ARR.',
    description: `We're looking for a driven Growth Marketing Manager to own our full-funnel acquisition strategy. You'll work directly with the founding team to scale paid, organic, and partnership channels.\n\nThis is a high-impact role with serious upside — you'll have budget authority, a lean team, and direct access to leadership. If you've scaled a brand before and thrive in fast-paced environments, we want to hear from you.`,
    location: 'New York, NY (or Remote)',
    locationType: 'hybrid',
    salary: '$95,000 – $130,000/yr + Equity',
    employmentType: 'full-time',
    companyName: 'ApplyFlow',
    whatsappPhone: '+1234567890',
    benefits: [
      'Competitive salary + equity package',
      'Remote-flexible (2 days/week in NYC)',
      'Comprehensive health, dental & vision',
      'Unlimited PTO + paid holidays',
      '$2,000/yr learning & development budget',
      'Top-tier equipment stipend',
    ],
    requirements: [
      '4+ years in growth or performance marketing',
      'Proven track record scaling D2C or SaaS brands',
      'Strong command of Meta Ads, Google Ads, and TikTok',
      'Data-driven — comfortable pulling and interpreting reports',
      'Experience managing agencies or in-house creative teams',
      'Excellent written and verbal communication',
    ],
    responsibilities: [
      'Own CAC/LTV optimization across all paid channels',
      'Build and manage a 7-figure annual ad budget',
      'Lead creative strategy in collaboration with design team',
      'Oversee SEO, email, and influencer marketing programs',
      'Report weekly on growth KPIs to executive leadership',
      'Hire and mentor a team of 2–3 junior marketers',
    ],
    tags: ['Marketing', 'Growth', 'DTC', 'Remote-friendly', 'Equity'],
    testimonials: [
      {
        name: 'Aisha Johnson',
        role: 'Former Growth Lead → Now VP Marketing',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'This role launched my career into the stratosphere. The autonomy, the budget, the team — everything was set up for success. I went from Growth Lead to VP in 18 months.',
        rating: 5,
      },
      {
        name: 'Marcus Chen',
        role: 'Alumni, now Founder',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        text: "I learned more in 2 years here than in my entire previous career. The speed, the resources, and the trust they give you is unlike anything I've experienced.",
        rating: 5,
      },
      {
        name: 'Priya Nair',
        role: 'Current Sr. Growth Manager',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        text: 'The culture is genuinely collaborative. Ideas from anyone get implemented fast. And the comp is real — I negotiated a package I never thought possible at 28.',
        rating: 5,
      },
    ],
    faqs: [
      {
        question: 'Is this role fully remote?',
        answer: 'The role is hybrid — we ask for 2 days per week in our NYC office. For exceptional candidates outside NYC, we are open to discussing fully remote arrangements.',
      },
      {
        question: 'What does the interview process look like?',
        answer: 'Screening call (30 min) → Marketing case study presentation → Final interview with founders. The whole process takes 2–3 weeks.',
      },
      {
        question: 'When does the role start?',
        answer: 'We are targeting a start date within 4–6 weeks of offer acceptance. We can be flexible for the right candidate.',
      },
      {
        question: 'Is there visa sponsorship available?',
        answer: 'Currently, we are only able to hire candidates who are authorized to work in the United States without sponsorship.',
      },
    ],
  },
  {
    title: 'Product Design Internship — Summer 2025',
    slug: 'product-design-intern-summer-2025',
    shortDescription: 'A paid 12-week design internship building real products used by millions.',
    description: `This isn't your typical internship — you'll ship real work from week one.\n\nWe're looking for a talented design intern who wants to work on complex product challenges, collaborate with senior designers, and build a portfolio that speaks for itself. You'll be embedded in our product team, attending all design crits and contributing to live features.`,
    location: 'San Francisco, CA',
    locationType: 'onsite',
    salary: '$35/hr + Housing Stipend',
    employmentType: 'internship',
    companyName: 'ApplyFlow',
    benefits: [
      '$35/hr — one of the highest intern rates in the industry',
      '$1,500 housing stipend',
      'Mentorship from senior designers',
      'Real product ownership — no busywork',
      'Return offer consideration for full-time roles',
      'MacBook Pro + Figma Pro provided',
    ],
    requirements: [
      'Currently enrolled in a Design, HCI, or related degree program',
      'Strong Figma skills (share your portfolio!)',
      'Understanding of UX research and design systems',
      'A portfolio that shows both craft and thinking',
      'Available for 12 weeks starting June 2, 2025',
    ],
    responsibilities: [
      'Design end-to-end features for our mobile and web apps',
      'Participate in weekly design reviews and critique',
      'Conduct lightweight user research and usability tests',
      'Collaborate with engineering on implementation',
      'Contribute to and maintain the design system',
    ],
    tags: ['Design', 'Internship', 'Figma', 'Product', 'San Francisco'],
    testimonials: [
      {
        name: 'Tyler Brooks',
        role: 'Design Intern → Now Full-time Designer',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        text: 'I shipped 3 features during my internship that are now used by 2 million people. The experience was worth more than my entire design degree.',
        rating: 5,
      },
      {
        name: 'Selena Park',
        role: 'Summer 2024 Intern',
        avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
        text: 'The mentorship here is world-class. My manager spent hours every week reviewing my work and pushing me to think more deeply. I grew so much.',
        rating: 5,
      },
    ],
    faqs: [
      {
        question: 'Do I need prior internship experience?',
        answer: "No — we care about your portfolio and your thinking, not your work history. If you're talented and driven, we want to hear from you.",
      },
      {
        question: 'Will there be a return offer?',
        answer: 'Strong interns are considered for full-time offers. Last year, 70% of our interns received return offers.',
      },
      {
        question: 'Can I do this internship remotely?',
        answer: 'This internship is in-person in San Francisco. We provide a housing stipend to help offset costs.',
      },
    ],
  },
  {
    title: 'Emerging Leaders Scholarship 2025',
    slug: 'emerging-leaders-scholarship-2025',
    shortDescription: '$25,000 scholarship + mentorship for first-gen college students in tech.',
    description: `The ApplyFlow Emerging Leaders Scholarship is awarded to 10 exceptional first-generation college students pursuing careers in technology.\n\nRecipients receive a $25,000 scholarship, a dedicated industry mentor, and access to our exclusive network of 500+ tech leaders. This is more than financial support — it's a launchpad.`,
    location: 'Nationwide (USA)',
    locationType: 'remote',
    salary: '$25,000 Award',
    employmentType: 'scholarship',
    companyName: 'ApplyFlow Foundation',
    benefits: [
      '$25,000 scholarship disbursed over 2 years',
      '1:1 mentorship with an industry leader',
      'Access to the ApplyFlow Alumni Network (500+ leaders)',
      'Priority access to internship and job opportunities',
      'Annual leadership summit (travel covered)',
      'Career coaching and resume review',
    ],
    requirements: [
      'First-generation college student (neither parent holds a 4-year degree)',
      'Pursuing a degree in Computer Science, Engineering, or Data Science',
      'GPA of 3.2 or higher',
      'Demonstrated financial need',
      'US citizen or permanent resident',
      'Sophomore, Junior, or Senior standing in Fall 2025',
    ],
    responsibilities: [
      'Maintain academic standing throughout scholarship period',
      'Engage actively with your assigned mentor (monthly calls)',
      'Attend the annual ApplyFlow Leadership Summit',
      'Contribute to the ApplyFlow alumni community',
      'Submit a mid-year and end-of-year progress report',
    ],
    tags: ['Scholarship', 'First-Gen', 'Tech', 'Mentorship', 'Nationwide'],
    testimonials: [
      {
        name: 'Darnell Washington',
        role: '2023 Scholar → Software Engineer at Google',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        text: "This scholarship didn't just pay my tuition — it changed my trajectory entirely. The network and mentorship opened doors I didn't know existed.",
        rating: 5,
      },
      {
        name: 'Fatima Al-Hassan',
        role: '2022 Scholar → Founder',
        avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
        text: 'Being surrounded by other first-gen scholars who were just as hungry as me was the most motivating experience of my college career.',
        rating: 5,
      },
    ],
    faqs: [
      {
        question: 'Who qualifies as a first-generation student?',
        answer: 'You are considered first-generation if neither of your parents or legal guardians completed a 4-year college or university degree.',
      },
      {
        question: 'When is the deadline to apply?',
        answer: 'Applications close March 31, 2025 at 11:59 PM ET. Awards are announced in May 2025.',
      },
      {
        question: 'Can I apply if I already have other scholarships?',
        answer: 'Yes. This scholarship can be stacked with other awards. There is no penalty for having other financial aid.',
      },
      {
        question: 'Is the scholarship renewable?',
        answer: 'Yes — the scholarship is paid over 2 years, contingent on maintaining a 3.2 GPA and active participation in the program.',
      },
    ],
  },
]

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected')

  console.log('🗑️  Clearing existing jobs...')
  await Job.deleteMany({})

  console.log('📝 Inserting sample jobs...')
  for (const job of sampleJobs) {
    await Job.create(job)
    console.log(`  ✅ Created: ${job.title}`)
  }

  console.log('\n🎉 Seed complete! Jobs created:')
  sampleJobs.forEach((j) => console.log(`  → /jobs/${j.slug}`))

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
