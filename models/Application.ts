import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId
  jobId: mongoose.Types.ObjectId
  jobTitle: string
  jobSlug: string
  name: string
  phone: string
  email: string
  instagram?: string
  location: string
  answer: string
  referral?: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
  notes?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobTitle: { type: String, required: true },
    jobSlug: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    instagram: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    answer: { type: String, required: true, minlength: 20 },
    referral: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending',
    },
    notes: String,
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Compound index to prevent duplicate submissions per job
ApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true })
ApplicationSchema.index({ jobId: 1, phone: 1 }, { unique: true })
ApplicationSchema.index({ jobId: 1 })
ApplicationSchema.index({ status: 1 })
ApplicationSchema.index({ createdAt: -1 })

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>('Application', ApplicationSchema)

export default Application
