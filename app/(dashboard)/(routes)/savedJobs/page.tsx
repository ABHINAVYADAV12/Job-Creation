import { getJobs } from "@/actions/get-jobs";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Box from "../search/_components/box";
import PageContent from "../search/_components/page-component";
import SearchContainer from "@/components/search-conatiner";

interface SearchProps {
  searchParams: {
    title: string;
    categoryId: string;
    createdAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
  };
}

const SavedJobsPage = async ({ searchParams }: SearchProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
    return null;
  }

  const jobs = await getJobs({
    ...searchParams,
    savedJobs: true,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2 bg-opacity-70 shadow-none border-none">
        <CustomBreadCrumb breadCrumbItem={[]} breadCrumbPage="Saved Jobs" />
      </Box>
      <Box className="w-full flex flex-col items-center justify-center bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="font-sans uppercase text-3xl md:text-4xl tracking-wider font-bold text-purple-800 mb-2">
          Saved Jobs
        </h2>
        <p className="text-muted-foreground text-lg">Easily revisit jobs you love</p>
      </Box>
      <div className="px-2 md:px-8 pt-2 md:mb-0">
        <SearchContainer />
      </div>
      <div className="p-2 md:p-6">
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </div>
  );
};

export default SavedJobsPage;
