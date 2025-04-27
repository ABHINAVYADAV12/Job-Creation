"use client";

import { useRouter } from "next/navigation";
import Box from "./search/_components/box";
import { HomesearchContainer } from "../_components/home-search-container";
import Image from "next/image";

const DashboardHomePage = () => {
  // Tags for filtering
  type TagFilter = {
    label: string;
    filter: {
      workMode?: string;
      shiftTiming?: string;
      tag?: string;
    };
  };
  const tags: TagFilter[] = [
    { label: 'Remote', filter: { workMode: 'Remote' } },
    { label: 'Full-time', filter: { shiftTiming: 'Full-time' } },
    { label: 'Part-time', filter: { shiftTiming: 'Part-time' } },
    { label: 'Internship', filter: { shiftTiming: 'Internship' } },
    { label: 'Tech', filter: { tag: 'Tech' } },
    { label: 'Design', filter: { tag: 'Design' } },
    { label: 'Management', filter: { tag: 'Management' } },
    { label: 'Startup', filter: { tag: 'Startup' } },
    { label: 'Entry Level', filter: { tag: 'Entry Level' } },
    { label: 'Experienced', filter: { tag: 'Experienced' } },
    { label: 'Flexible', filter: { tag: 'Flexible' } },
    { label: 'Trending', filter: { tag: 'Trending' } },
  ];
  const router = useRouter();
  // Helper for tag click
  function handleTagClick(tagObj: TagFilter) {
    const params = new URLSearchParams();
    if (tagObj.filter.workMode) params.set('workMode', tagObj.filter.workMode);
    if (tagObj.filter.shiftTiming) params.set('shiftTiming', tagObj.filter.shiftTiming);
    if (tagObj.filter.tag) params.set('tag', tagObj.filter.tag);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-col py-8 px-2 md:px-8 space-y-14 min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white">
      <Box className="flex flex-col justify-center items-center w-full space-y-4 mt-8 bg-white/90 rounded-3xl shadow-2xl p-10 backdrop-blur-md border border-purple-300">
        <div className="flex flex-col md:flex-row items-center gap-10 w-full">
          <Image
            alt="Career Hub Logo"
            src="/img/logo.png"
            width={140}
            height={140}
            className="object-contain rounded-full shadow-2xl border-4 border-purple-400 bg-white"
          />
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-purple-900 drop-shadow-2xl">
              Find Your Dream Job
            </h2>
            <p className="text-xl md:text-3xl text-purple-700/90 font-semibold mt-4">
              Explore opportunities tailored for you
            </p>
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl text-center">
          Discover the latest jobs in tech, design, management, and more. Start your career journey with Career Hub today!
        </p>
      </Box>
      <HomesearchContainer />
      <div className="w-full flex justify-center">
        <Image
          alt="Home Screen Banner"
          src="/img/job-portal.jpg"
          width={700}
          height={180}
          className="object-cover rounded-2xl shadow-xl border border-purple-200"
        />
      </div>
      <div className="flex flex-wrap gap-3 justify-center mt-8">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-200 via-blue-100 to-white text-purple-900 text-base font-semibold border border-purple-300 shadow hover:bg-purple-300/60 hover:text-white cursor-pointer transition-all duration-150"
            onClick={() => handleTagClick(tag)}
          >
            #{tag.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DashboardHomePage;
