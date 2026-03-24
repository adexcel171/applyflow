import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth";
import connectDB from "@/lib/db";
import Job from "@/models/Job";
import Application from "@/models/Application";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminPage() {
  const admin = getAdminFromCookies();
  if (!admin) {
    redirect("/admin/login");
  }

  try {
    await connectDB();

    const [jobs, recentApps, totalApps] = await Promise.all([
      Job.find({}).sort({ createdAt: -1 }).lean(),
      Application.find({}).sort({ createdAt: -1 }).limit(10).lean(),
      Application.countDocuments(),
    ]);

    const activeJobs = jobs.filter((j) => j.isActive).length;
    const totalViews = jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0);

    return (
      <AdminDashboardClient
        initialJobs={JSON.parse(JSON.stringify(jobs))}
        recentApps={JSON.parse(JSON.stringify(recentApps))}
        stats={{ totalJobs: jobs.length, activeJobs, totalApps, totalViews }}
        adminEmail={admin.email}
      />
    );
  } catch {
    return (
      <AdminDashboardClient
        initialJobs={[]}
        recentApps={[]}
        stats={{ totalJobs: 0, activeJobs: 0, totalApps: 0, totalViews: 0 }}
        adminEmail={admin.email}
      />
    );
  }
}
