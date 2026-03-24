"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Instagram,
  MapPin,
  MessageSquare,
  Share2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  instagram: z.string().optional(),
  location: z.string().min(2, "Please enter your location"),
  answer: z
    .string()
    .min(20, "Please write at least 20 characters")
    .max(2000, "Max 2000 characters"),
  referral: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  job: { _id: string; title: string; slug: string };
}

const referralOptions = [
  "Instagram",
  "Twitter / X",
  "LinkedIn",
  "Friend / Referral",
  "Google",
  "WhatsApp",
  "Email",
  "Other",
];

function SuccessView({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className="text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
        }}
        className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <CheckCircle2 className="w-10 h-10 text-white" />
      </motion.div>

      {/* Confetti dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          animate={{
            opacity: 0,
            y: -80 - Math.random() * 80,
            x: (Math.random() - 0.5) * 160,
            scale: 0,
          }}
          transition={{ delay: 0.3 + i * 0.04, duration: 0.8 }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ["#0c93ea", "#f97316", "#10b981", "#8b5cf6", "#ec4899"][
              i % 5
            ],
            left: "50%",
            top: "40%",
          }}
        />
      ))}

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-3xl font-bold text-white mb-3"
      >
        You&apos;re In, {name.split(" ")[0]}! 🎉
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 font-body text-base max-w-sm mx-auto leading-relaxed"
      >
        Your application has been received. Check your email and WhatsApp for a
        confirmation message. We&apos;ll be in touch within 2–3 business days!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mt-8 grid grid-cols-3 gap-4 max-w-xs mx-auto"
      >
        {["📧 Email Sent", "💬 WhatsApp", "📱 SMS"].map((label) => (
          <div
            key={label}
            className="bg-white/10 rounded-xl p-3 text-white/70 text-xs font-body"
          >
            {label}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

interface FieldProps {
  label: string;
  icon: React.ElementType;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, icon: Icon, error, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white/80 mb-1.5 font-body">
        {label} {required && <span className="text-accent-400">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-red-400 font-body flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ApplicationForm({ job }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const answerValue = watch("answer") || "";

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, jobId: job._id, jobSlug: job.slug }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error(
            json.message || "You have already applied for this opportunity.",
          );
        } else if (res.status === 429) {
          toast.error(
            "Too many attempts. Please slow down and try again shortly.",
          );
        } else if (json.errors) {
          const firstError = Object.values(json.errors)[0] as string[];
          toast.error(firstError[0] || "Please check your inputs.");
        } else {
          toast.error(
            json.message || "Something went wrong. Please try again.",
          );
        }
        return;
      }

      setSubmittedName(data.name);
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  const inputClass = (hasError?: boolean) =>
    cn(
      "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border text-white placeholder:text-white/30",
      "focus:outline-none focus:ring-2 focus:border-transparent font-body text-[15px]",
      "transition duration-150 backdrop-blur-sm",
      hasError
        ? "border-red-400/60 focus:ring-red-400/50"
        : "border-white/20 focus:ring-brand-400/60 hover:border-white/30",
    );

  return (
    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden shadow-glow-lg">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <SuccessView name={submittedName} />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit(onSubmit)}
            className="p-7 sm:p-8 space-y-5"
            noValidate
          >
            {/* Header */}
            <div className="pb-2">
              <h3 className="font-display text-2xl font-bold text-white">
                Submit Your Application
              </h3>
              <p className="text-white/50 font-body text-sm mt-1">
                All fields marked with{" "}
                <span className="text-accent-400">*</span> are required
              </p>
            </div>

            {/* Name + Phone */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                icon={User}
                error={errors.name?.message}
                required
              >
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Jane Doe"
                  className={inputClass(!!errors.name)}
                  autoComplete="name"
                />
              </Field>

              <Field
                label="Phone Number"
                icon={Phone}
                error={errors.phone?.message}
                required
              >
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className={inputClass(!!errors.phone)}
                  autoComplete="tel"
                />
              </Field>
            </div>

            {/* Email + Instagram */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Email Address"
                icon={Mail}
                error={errors.email?.message}
                required
              >
                <input
                  {...register("email")}
                  type="email"
                  placeholder="jane@example.com"
                  className={inputClass(!!errors.email)}
                  autoComplete="email"
                />
              </Field>

              <Field
                label="Instagram Handle"
                icon={Instagram}
                error={errors.instagram?.message}
              >
                <input
                  {...register("instagram")}
                  type="text"
                  placeholder="@yourhandle"
                  className={inputClass(!!errors.instagram)}
                />
              </Field>
            </div>

            {/* Location */}
            <Field
              label="Your Location"
              icon={MapPin}
              error={errors.location?.message}
              required
            >
              <input
                {...register("location")}
                type="text"
                placeholder="City, Country"
                className={inputClass(!!errors.location)}
                autoComplete="address-level2"
              />
            </Field>

            {/* Short Answer */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1.5 font-body">
                Why are you a good fit?{" "}
                <span className="text-accent-400">*</span>
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30" />
                <textarea
                  {...register("answer")}
                  rows={4}
                  placeholder="Tell us about your background, skills, and why this opportunity excites you..."
                  className={cn(
                    inputClass(!!errors.answer),
                    "pl-10 resize-none leading-relaxed",
                  )}
                />
              </div>
              <div className="flex justify-between items-center mt-1.5">
                {errors.answer ? (
                  <p className="text-xs text-red-400 font-body flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.answer.message}
                  </p>
                ) : (
                  <span />
                )}
                <span
                  className={cn(
                    "text-xs font-body ml-auto",
                    answerValue.length > 1800
                      ? "text-red-400"
                      : "text-white/30",
                  )}
                >
                  {answerValue.length}/2000
                </span>
              </div>
            </div>

            {/* Referral */}
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-1.5 font-body">
                How did you hear about us?{" "}
                <span className="text-white/30 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Share2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <select
                  {...register("referral")}
                  className={cn(
                    inputClass(),
                    "pl-10 cursor-pointer bg-surface-900/50",
                  )}
                >
                  <option value="" className="bg-surface-900">
                    Select source...
                  </option>
                  {referralOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-surface-900">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={cn(
                  "w-full py-4 px-8 rounded-xl font-semibold text-base font-body flex items-center justify-center gap-2 transition-all duration-200",
                  isSubmitting
                    ? "bg-white/20 text-white/50 cursor-not-allowed"
                    : "bg-white text-brand-700 hover:bg-brand-50 shadow-glow",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>Submit Application✦</>
                )}
              </motion.button>

              <p className="text-center text-white/30 text-xs font-body mt-3">
                🔒
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
