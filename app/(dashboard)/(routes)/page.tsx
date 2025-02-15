import { getJobs } from "@/actions/get-jobs"; // Assuming you have this function
import Box from "./search/_components/box";
import { HomesearchContainer } from "../_components/home-search-container";
import Image from "next/image";

const DashboardHomePage = async () => {
  const jobs = await getJobs({}); // Fetching jobs

  return (
    <div className="flex-col py-6 px-4 space-y-24">
      <Box className="flex-col justify-center w-full space-y-4 mt-12">
        <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wide text-neutral-600">
          Career Hub
        </h2>
        <p className="text-2xl text-muted-foreground">{jobs.length}+ jobs for you to explore</p>
      </Box>
      <HomesearchContainer />
      <Image
        alt="Home Screen Banner"
        src="/img/job-portal.jpg"
        width={1000}
        height={240}
        className="object-cover rounded-lg"
      />
    </div>
  );
};

export default DashboardHomePage;
