import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart2, Users, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";

export default async function AnalyticsPage() {
  const { userId } = auth();
  if (!userId) return redirect("/");
  const userProfile = await db.userProfile.findUnique({ where: { userId } });
  if (!userProfile || userProfile.role !== "admin") return redirect("/");

  // Fetch analytics data
  const [jobsCount, usersCount, companiesCount, recentJobs] = await Promise.all([
    db.job.count(),
    db.userProfile.count(),
    db.company.count(),
    db.job.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } }),
  ]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/jobs">
          <ArrowLeft className="w-6 h-6 text-purple-700" />
        </Link>
        <h1 className="text-3xl font-bold text-purple-900 flex items-center gap-2">
          <BarChart2 className="w-7 h-7 text-purple-700" /> Analytics
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 flex flex-col items-center shadow">
          <Briefcase className="w-10 h-10 text-purple-700 mb-2" />
          <div className="text-2xl font-bold text-purple-900">{jobsCount}</div>
          <div className="text-purple-700 text-lg">Jobs Posted</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col items-center shadow">
          <Users className="w-10 h-10 text-blue-700 mb-2" />
          <div className="text-2xl font-bold text-blue-900">{usersCount}</div>
          <div className="text-blue-700 text-lg">Users Registered</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col items-center shadow">
          <Building2 className="w-10 h-10 text-green-700 mb-2" />
          <div className="text-2xl font-bold text-green-900">{companiesCount}</div>
          <div className="text-green-700 text-lg">Companies</div>
        </div>
      </div>
      <div className="bg-white border border-purple-100 rounded-2xl p-6 shadow mt-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-800">Recent Job Postings</h2>
        <ul className="divide-y divide-purple-100">
          {recentJobs.map(job => (
            <li key={job.id} className="py-2 flex justify-between items-center">
              <span className="font-medium text-purple-900">{job.title}</span>
              <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
