"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, format } from "date-fns";

export const SidebarFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Defensive: fallback to empty string if searchParams is null
  const getParam = (key: string) => searchParams?.get(key) || "";
  const [shiftTiming, setShiftTiming] = useState(getParam("shiftTiming"));
  const [workMode, setWorkMode] = useState(getParam("workMode"));
  const [hourlyRate, setHourlyRate] = useState(getParam("hourlyRate"));
  const [createdAtFilter, setCreatedAtFilter] = useState<string>(getParam("createdAtFilter"));
  const [calendarValue, setCalendarValue] = useState<string>(createdAtFilter);

  const applyFilters = () => {
    // Defensive: fallback to empty params if searchParams is null
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (shiftTiming) params.set("shiftTiming", shiftTiming); else params.delete("shiftTiming");
    if (workMode) params.set("workMode", workMode); else params.delete("workMode");
    if (hourlyRate) params.set("hourlyRate", hourlyRate); else params.delete("hourlyRate");
    if (createdAtFilter) params.set("createdAtFilter", createdAtFilter); else params.delete("createdAtFilter");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow border mt-6 max-w-full w-full overflow-x-auto" style={{ minHeight: 350, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', paddingBottom: 72, position: 'relative' }}>
      <div className="font-semibold text-lg mb-4 text-center">Filters</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Job Type</span>
          <select value={shiftTiming} onChange={e => setShiftTiming(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Work Mode</span>
          <select value={workMode} onChange={e => setWorkMode(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Min Hourly Rate</span>
          <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="border rounded px-2 py-1" placeholder="e.g. 20" />
        </label>
        <label className="flex flex-col gap-1 relative">
          <span className="text-sm text-gray-700">Posted After</span>
          <DatePicker
            selected={calendarValue ? parseISO(calendarValue) : null}
            onChange={date => {
              if (date) {
                const iso = format(date as Date, "yyyy-MM-dd");
                setCalendarValue(iso);
                setCreatedAtFilter(iso);
              } else {
                setCalendarValue("");
                setCreatedAtFilter("");
              }
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
            className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 text-gray-800 w-full min-w-0 cursor-pointer"
            popperPlacement="bottom-start"
            popperClassName="z-50"
            isClearable
            showPopperArrow
          />
        </label>
      </div>
      <button onClick={applyFilters} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded px-4 py-2 font-semibold transition w-full sticky bottom-0 z-50">
        Apply Filters
      </button>
    </div>
  );
};
