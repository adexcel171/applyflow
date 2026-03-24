import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  slug: string
  description: string
  shortDescription: string
  location: string
  locationType: 'remote' | 'onsite' | 'hybrid'
  salary: string
  salaryRange?: { min: number; max: number }
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'scholarship'
  benefits: string[]
  requirements: string[]
  responsibilities: string[]
  isActive: boolean
  viewCount: number
  applicationCount: number
  tags: string[]
  heroImage?: string
  companyName?: string
  companyLogo?: string
  testimonials: {
    name: string
    role: string
    avatar?: string
    text: string
    rating: number
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  whatsappPhone?: string
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: String,
  text: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
})

const FAQSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
})

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    location: { type: String, required: true },
    locationType: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote',
    },
    salary: { type: String, required: true },
    salaryRange: {
      min: Number,
      max: Number,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'scholarship'],
      default: 'full-time',
    },
    benefits: [{ type: String }],
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    heroImage: String,
    companyName: { type: String, default: 'ApplyFlow' },
    companyLogo: String,
    testimonials: [TestimonialSchema],
    faqs: [FAQSchema],
    whatsappPhone: String,
    deadline: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Index for fast slug lookup
JobSchema.index({ slug: 1 })
JobSchema.index({ isActive: 1 })

const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)

export default Job
