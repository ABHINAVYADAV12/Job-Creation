import { getJobs } from "@/actions/get-jobs"; // Assuming you have this function
import Box from "./search/_components/box";
import { HomesearchContainer } from "../_components/home-search-container";
import Image from "next/image";

const DashboardHomePage = async () => {
  const jobs = await getJobs({}); // Fetching jobs

  return (
    <div className="flex flex-col py-8 px-2 md:px-8 space-y-14 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Box className="flex flex-col justify-center items-center w-full space-y-4 mt-8 bg-white/80 rounded-2xl shadow-lg p-8 backdrop-blur-md">
        <Image
          alt="Career Hub Logo"
          src="/img/logo.png"
          width={120}
          height={120}
          className="object-contain rounded-full mb-4 shadow-lg border-4 border-blue-100"
        />
        <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-wide text-blue-700">
          Career Hub
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground">{jobs.length}+ jobs for you to explore</p>
      </Box>
      <HomesearchContainer />
      <div className="w-full flex justify-center">
        <Image
          alt="Home Screen Banner"
          src="/img/job-portal.jpg"
          width={1000}
          height={240}
          className="object-cover rounded-2xl shadow-xl border border-blue-100"
        />
      </div>
    </div>
  );
};

export default DashboardHomePage;
