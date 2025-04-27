"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import Box from "../(routes)/search/_components/box";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const HomesearchContainer = () => {
  const [title, setTitle] = useState("");
  const [shiftTiming, setShiftTiming] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [createdAtFilter, setCreatedAtFilter] = useState<Date | null>(null);
  const router = useRouter();

  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || undefined,
        shiftTiming: shiftTiming || undefined,
        workMode: workMode || undefined,
        hourlyRate: hourlyRate || undefined,
        createdAtFilter: createdAtFilter ? createdAtFilter.toISOString() : undefined,
      },
    });
    router.push(href);
  };

  return (
    <div className="w-full flex items-center justify-center mt-12 px-6 md:px-12">
      <Box className="w-full md:w-3/4 p-6 rounded-lg shadow-xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 bg-white">
        <Input
          placeholder="Search by job title..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-xl font-medium bg-transparent outline-none border border-gray-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <select
            value={shiftTiming}
            onChange={e => setShiftTiming(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 bg-transparent text-base md:text-xl"
          >
            <option value="">All Timings</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
          <select
            value={workMode}
            onChange={e => setWorkMode(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 bg-transparent text-base md:text-xl"
          >
            <option value="">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <Input
            placeholder="Hourly Rate (min)"
            type="number"
            value={hourlyRate}
            onChange={e => setHourlyRate(e.target.value)}
            className="w-32 text-base md:text-xl font-medium bg-transparent outline-none border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={createdAtFilter ? createdAtFilter.toISOString().split('T')[0] : ''}
            onChange={e => setCreatedAtFilter(e.target.value ? new Date(e.target.value) : null)}
            className="border border-gray-300 rounded-lg py-2 px-3 text-base md:text-xl"
          />
        </div>
        <Button
          onClick={handleClick}
          className={`bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-3 ml-0 md:ml-2`}
          size="icon"
        >
          <Search className="w-5 h-5"/>
        </Button>
      </Box>
    </div>
  );
};
