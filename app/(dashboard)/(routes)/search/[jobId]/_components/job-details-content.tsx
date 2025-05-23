"use client";

import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Company, Job, Resumes, UserProfile } from "@prisma/client";
import Image from "next/image";
import Box from "../../_components/box";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Preview from "@/components/preview";
import { ApplyModal } from "@/components/ui/apply-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null };
  jobId: string;
  userProfile: UserProfile & { resumes: Resumes[] } | null;
  hasApplied?: boolean;
}

const JobDetailsPageContent = ({ job, jobId, userProfile, hasApplied }: JobDetailsPageContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onApplied = async () => {
    setIsLoading(true);

    try {
      // Send POST request to create Application entry
      await axios.post(`/api/jobs/${jobId}/apply`, {
        userId: userProfile?.userId,
        resumeUrl: userProfile?.resumes.find(
          (resume) => resume.id === userProfile?.activeResumeId
        )?.url || null,
      });
      toast.success("Successfully applied for the job!");
    } catch (error) {
      console.log((error as Error).message);
      toast.error("Something went wrong.. Please try again.");
    } finally {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <ApplyModal isOpen={open} onCloseAction={() => setOpen(false)} onConfirmAction={onApplied} loading={isLoading} userProfile={userProfile} />

      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job?.title !== undefined ? job.title : "Job Details"}
        />
      </Box>

      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image alt={job?.title || "Job Image"} fill className="object-cover w-full h-full" src={job.imageUrl} />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
      </Box>

      <Box className="mt-4">
        <div className="space-y-2">
          {/* Job Title */}
          <h2 className="text-2xl font-semibold text-neutral-600">{job?.title || "Job Title Unavailable"}</h2>

          <Link href={`/companies/${job.companyId}`}>
            {/* Company Info */}
            <div className="flex items-center gap-2 mt-1">
              {job?.company?.logo ? (
                <Image alt={job.company.name || "Company Logo"} width={25} height={25} src={job.company.logo} />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Logo</span>
                </div>
              )}
              <p className="text-sm text-neutral-500 font-semibold">{job?.company?.name || "Company Name Unavailable"}</p>
            </div>
          </Link>
        </div>

        {/* Action Button */}
        <div>
          {userProfile ? (
            <>
              {!hasApplied ? (
                <Button className="text-sm bg-purple-700 hover:bg-purple-900 hover:shadow-sm" onClick={() => setOpen(true)}>
                  Apply
                </Button>
              ) : (
                <Button className="text-sm text-purple-700 border-purple-500 hover:bg-purple-900 hover:text-white hover:shadow-sm" variant="outline">
                  Already Applied
                </Button>
              )}
            </>
          ) : (
            <Link href="/user">
              <Button className="text-sm px-8 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-900 hover:shadow-sm">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* Description */}
      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">Description:</h2>
        <p className="font-sans">{job?.short_description}</p>
      </Box>

      {job?.description && (
        <Box>
          <Preview value={job?.description} />
        </Box>
      )}
    </>
  );
};

export default JobDetailsPageContent;
