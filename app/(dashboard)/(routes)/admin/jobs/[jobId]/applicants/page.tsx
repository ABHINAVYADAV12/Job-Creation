"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  resumeUrl?: string;
  appliedAt: string;
}

// Columns for DataTable (must use accessorKey/id, not just accessor/Header)
const columns: ColumnDef<Applicant>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "resumeUrl",
    header: "Resume",
    // eslint-disable-next-line no-unused-vars
    cell: ({ getValue }) => {
      const value = getValue() as string | undefined;
      return value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Resume</a>
      ) : (
        <span className="text-gray-400">N/A</span>
      );
    },
  },
  {
    accessorKey: "appliedAt",
    header: "Applied At",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
  },
];

const ApplicantsPage = ({ params }: { params: { jobId: string } }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/jobs/${params.jobId}/applicants`);
        setApplicants(res.data);
      } catch {
        // Optionally handle error, maybe redirect or toast
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [params.jobId]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : applicants.length === 0 ? (
            <div className="text-center text-gray-500">No applicants yet.</div>
          ) : (
            <DataTable columns={columns} data={applicants} searchKey="fullName" />
          )}
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default ApplicantsPage;
