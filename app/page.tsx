import { Metadata } from "next";
import Link from "next/link";
import connectDB from "@/lib/db";
import Job, { IJob } from "@/models/Job";
import {
  MapPin,
  DollarSign,
  ArrowRight,
  Zap,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "ApplyFlow — Where Opportunity Meets Ambition",
};

export const revalidate = 60;

async function getActiveJobs() {
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true })
      .select(
        "title slug shortDescription location locationType salary employmentType tags applicationCount",
      )
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(jobs)) as Partial<IJob>[];
  } catch {
    return [];
  }
}

const employmentColors: Record<string, string> = {
  "full-time":
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  "part-time": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  contract: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  internship: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  scholarship: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
};

const locationColors: Record<string, string> = {
  remote: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  hybrid: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
  onsite: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

export default async function HomePage() {
  const jobs = await getActiveJobs();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand: #6366f1;
          --brand-light: #818cf8;
          --brand-dark: #4f46e5;
          --surface: #0a0a0f;
          --surface-1: #111118;
          --surface-2: #1a1a24;
          --surface-3: #24243a;
          --text: #f0f0ff;
          --text-muted: #8888aa;
          --text-faint: #44445a;
          --border: rgba(255,255,255,0.07);
          --card-bg: rgba(20, 20, 35, 0.8);
        }

        body {
          background: var(--surface);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .font-display { font-family: 'Bricolage Grotesque', sans-serif; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(10,10,15,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          max-width: 1200px; margin: 0 auto;
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--text);
        }
        .logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, var(--brand-light), var(--brand-dark));
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }
        .logo-text { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 18px; }
        .nav-link {
          font-size: 13px; color: var(--text-muted);
          text-decoration: none; padding: 6px 14px;
          border: 1px solid var(--border); border-radius: 8px;
          transition: all 0.2s;
        }
        .nav-link:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100svh;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          background: #050508;
        }

        /* Video background */
        .hero-video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.18;
          filter: saturate(0.6) brightness(0.8);
          z-index: 0;
        }

        /* Gradient overlays on top of video */
        .hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.15) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(5,5,8,0.3) 0%, rgba(5,5,8,0.7) 60%, rgba(10,10,15,1) 100%);
        }

        /* Animated grid lines */
        .hero-grid {
          position: absolute; inset: 0; z-index: 1;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 30%, black 0%, transparent 80%);
        }

        /* Floating orbs */
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          animation: float 8s ease-in-out infinite;
          z-index: 1;
        }
        .orb-1 { width: 500px; height: 500px; top: -100px; left: -100px; background: rgba(99,102,241,0.12); animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; bottom: -50px; right: -80px; background: rgba(139,92,246,0.1); animation-delay: 3s; }
        .orb-3 { width: 300px; height: 300px; top: 40%; left: 60%; background: rgba(59,130,246,0.08); animation-delay: 5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* Hero content */
        .hero-content {
          position: relative; z-index: 2;
          text-align: center; padding: 40px 24px;
          max-width: 860px; margin: 0 auto;
          animation: heroFadeUp 1s ease forwards;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 100px; padding: 6px 16px;
          font-size: 13px; font-weight: 500; color: var(--brand-light);
          margin-bottom: 32px;
          backdrop-filter: blur(10px);
          animation: heroFadeUp 1s ease 0.1s both;
        }

        .ping-dot {
          position: relative; display: flex; width: 8px; height: 8px;
        }
        .ping-dot::before {
          content: ''; position: absolute; inset: 0;
          border-radius: 50%; background: #34d399;
          animation: ping 1.5s ease-in-out infinite;
        }
        .ping-dot::after {
          content: ''; position: absolute; inset: 1px;
          border-radius: 50%; background: #34d399;
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(2.2); opacity: 0; }
        }

        .hero-h1 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(48px, 8vw, 88px);
          font-weight: 800; line-height: 1.02;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 24px;
          animation: heroFadeUp 1s ease 0.2s both;
        }

        .hero-h1 .line2 {
          display: block;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: clamp(16px, 2vw, 19px);
          color: rgba(240,240,255,0.55);
          max-width: 560px; margin: 0 auto 40px;
          line-height: 1.65; font-weight: 300;
          animation: heroFadeUp 1s ease 0.3s both;
        }

        .hero-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, var(--brand), #7c3aed);
          color: white; text-decoration: none;
          padding: 14px 32px; border-radius: 12px;
          font-weight: 600; font-size: 15px;
          box-shadow: 0 0 40px rgba(99,102,241,0.35), 0 4px 20px rgba(0,0,0,0.4);
          transition: all 0.25s; position: relative; overflow: hidden;
          animation: heroFadeUp 1s ease 0.4s both;
        }
        .hero-cta::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.2s;
        }
        .hero-cta:hover::before { opacity: 1; }
        .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(99,102,241,0.5), 0 8px 30px rgba(0,0,0,0.5); }

        /* Stats row */
        .hero-stats {
          display: flex; justify-content: center; gap: 0;
          margin-top: 72px;
          animation: heroFadeUp 1s ease 0.5s both;
        }
        .stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 0 32px;
          position: relative;
        }
        .stat + .stat::before {
          content: ''; position: absolute; left: 0; top: 10%; height: 80%;
          width: 1px; background: var(--border);
        }
        .stat-icon { color: var(--brand-light); margin-bottom: 4px; opacity: 0.7; }
        .stat-value {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 28px; font-weight: 700; color: #fff; line-height: 1;
        }
        .stat-label { font-size: 11px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }

        /* Wave divider */
        .wave { display: block; margin-top: -2px; }

        /* ── SECTION ── */
        .section {
          max-width: 1200px; margin: 0 auto;
          padding: 80px 24px;
        }

        .section-header { margin-bottom: 48px; }
        .section-eyebrow {
          font-size: 11px; font-weight: 600;
          color: var(--brand-light); text-transform: uppercase;
          letter-spacing: 0.12em; margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(28px, 4vw, 40px); font-weight: 700;
          color: var(--text); letter-spacing: -0.02em; margin-bottom: 10px;
        }
        .section-sub { font-size: 16px; color: var(--text-muted); font-weight: 300; }

        /* ── JOB CARDS ── */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }

        .job-card {
          display: flex; flex-direction: column;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 24px;
          text-decoration: none; color: inherit;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .job-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.04), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .job-card:hover {
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1);
        }
        .job-card:hover::before { opacity: 1; }

        .card-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 16px;
        }
        .badges { display: flex; flex-wrap: wrap; gap: 6px; }
        .badge {
          font-size: 11px; font-weight: 500; padding: 3px 10px;
          border-radius: 100px; text-transform: capitalize; letter-spacing: 0.01em;
        }

        .arrow-icon {
          color: var(--text-faint); flex-shrink: 0;
          transition: all 0.25s;
        }
        .job-card:hover .arrow-icon { color: var(--brand-light); transform: translate(3px, -3px); }

        .card-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 20px; font-weight: 700;
          color: var(--text); margin-bottom: 8px;
          line-height: 1.25; transition: color 0.2s;
        }
        .job-card:hover .card-title { color: var(--brand-light); }

        .card-desc {
          font-size: 14px; color: var(--text-muted);
          line-height: 1.6; margin-bottom: 20px; flex: 1;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .card-meta {
          border-top: 1px solid var(--border);
          padding-top: 16px; display: flex; flex-direction: column; gap: 6px;
        }
        .meta-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--text-muted);
        }
        .meta-icon { color: var(--text-faint); flex-shrink: 0; }

        /* Empty state */
        .empty {
          text-align: center; padding: 80px 24px;
          color: var(--text-muted);
        }
        .empty-emoji { font-size: 56px; margin-bottom: 16px; }
        .empty-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }
        .empty-sub { font-size: 15px; }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid var(--border);
          background: var(--surface-1);
          padding: 40px 24px;
        }
        .footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .footer-copy { font-size: 13px; color: var(--text-faint); }

        @media (max-width: 640px) {
          .hero-stats { gap: 0; }
          .stat { padding: 0 20px; }
          .stat-value { font-size: 22px; }
          .jobs-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
        {/* ── NAV ── */}
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="logo">
              <div className="logo-mark">
                <Zap size={16} color="white" fill="white" />
              </div>
              <span className="logo-text">ApplyFlow</span>
            </Link>
            <Link href="/admin" className="nav-link">
              Admin →
            </Link>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="hero">
          {/*
            Background video — replace the src with any looping mp4.
            Great free sources: Pexels, Mixkit, Coverr.
            Example: a city timelapse, abstract tech, people working.
            The video is intentionally dim (opacity 0.18) so text stays readable.
          */}
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            src="https://www.w3schools.com/howto/rain.mp4"
          />

          {/* Overlays */}
          <div className="hero-overlay" />
          <div className="hero-grid" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          {/* Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="ping-dot" />
              {jobs.length}{" "}
              {jobs.length === 1 ? "opportunity" : "opportunities"} open right
              now
            </div>

            <h1 className="hero-h1 font-display">
              Where Opportunity
              <span className="line2">Meets Ambition</span>
            </h1>

            <p className="hero-sub">
              ApplyFlow connects driven individuals with transformative jobs,
              scholarships, and programs. Apply in minutes. Change your
              trajectory.
            </p>

            <a href="#opportunities" className="hero-cta">
              Explore Opportunities
              <ArrowRight size={16} />
            </a>

            {/* Stats */}
            <div className="hero-stats">
              {[
                { icon: Users, label: "Applicants", value: "12,400+" },
                { icon: Star, label: "Success Rate", value: "94%" },
                { icon: TrendingUp, label: "Avg. Response", value: "48hrs" },
              ].map(({ icon: Icon, label, value }) => (
                <div className="stat" key={label}>
                  <Icon className="stat-icon" size={16} />
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OPPORTUNITIES ── */}
        <section id="opportunities" className="section">
          <div className="section-header">
            <div className="section-eyebrow">Live Listings</div>
            <h2 className="section-title font-display">Open Opportunities</h2>
            <p className="section-sub">
              Hand-picked roles and programs accepting applications right now.
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="empty">
              <div className="empty-emoji">🔭</div>
              <p className="empty-title font-display">
                No opportunities open right now.
              </p>
              <p className="empty-sub">
                Check back soon — new listings drop weekly.
              </p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <Link
                  key={String(job._id)}
                  href={`/jobs/${job.slug}`}
                  className="job-card"
                >
                  <div className="card-top">
                    <div className="badges">
                      <span
                        className={`badge ${employmentColors[job.employmentType || "full-time"]}`}
                      >
                        {job.employmentType}
                      </span>
                      <span
                        className={`badge ${locationColors[job.locationType || "remote"]}`}
                      >
                        {job.locationType}
                      </span>
                    </div>
                    <ArrowRight className="arrow-icon" size={18} />
                  </div>

                  <h3 className="card-title font-display">{job.title}</h3>
                  <p className="card-desc">{job.shortDescription}</p>

                  <div className="card-meta">
                    <div className="meta-item">
                      <MapPin className="meta-icon" size={13} />
                      {job.location}
                    </div>
                    <div className="meta-item">
                      <DollarSign className="meta-icon" size={13} />
                      {job.salary}
                    </div>
                    {(job.applicationCount ?? 0) > 0 && (
                      <div className="meta-item">
                        <Users className="meta-icon" size={13} />
                        {job.applicationCount} applied
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-inner">
            <Link href="/" className="logo">
              <div
                className="logo-mark"
                style={{ width: 28, height: 28, borderRadius: 8 }}
              >
                <Zap size={13} color="white" fill="white" />
              </div>
              <span className="logo-text" style={{ fontSize: 15 }}>
                ApplyFlow
              </span>
            </Link>
            <p className="footer-copy">
              © {new Date().getFullYear()} ApplyFlow. Built to unlock potential.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
