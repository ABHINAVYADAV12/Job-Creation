"use client";

import React from "react";
import { Job } from "@prisma/client";
import JobCardItem from "../../search/_components/job-card-item";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AppliedJobsSectionProps {
  jobs: Job[];
  userId: string;
}

const AppliedJobsSection: React.FC<AppliedJobsSectionProps> = ({ jobs, userId }) => {
  const router = useRouter();

  const handleRemove = async (jobId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/removeappliedjob`, { jobId });
      router.refresh();
    } catch {
      // Optionally show error toast
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white/80 rounded-xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-2 text-purple-800">Applied Jobs</h2>
        <p className="text-gray-500">You haven&apos;t applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Applied Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="relative">
            <JobCardItem job={job} userId={userId} />
            <button
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-700"
              onClick={() => handleRemove(job.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobsSection;
