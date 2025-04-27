"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarCalendar from "./sidebar-calendar";
import "react-datepicker/dist/react-datepicker.css";

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
    <div className="p-4 bg-white rounded-xl shadow border mt-6 max-w-xs mx-auto" style={{ minHeight: 350, maxHeight: 'calc(100vh - 180px)', overflowY: 'auto', paddingBottom: 72, position: 'relative' }}>
      <div className="font-semibold text-lg mb-4 text-center">Filters</div>
      <div className="flex flex-col gap-6 pb-32">
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
          <SidebarCalendar value={calendarValue ? new Date(calendarValue) : null} onChangeAction={date => {
            if (date) {
              const iso = date.toISOString().slice(0, 10);
              setCalendarValue(date.toISOString());
              setCreatedAtFilter(iso);
            } else {
              setCalendarValue("");
              setCreatedAtFilter("");
            }
          }} />
          {calendarValue && (
            <span className="text-xs text-gray-500 mt-1">Selected: {new Date(calendarValue).toLocaleDateString()}</span>
          )}
        </label>
      </div>
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t flex gap-2 p-4 w-full max-w-xs mx-auto shadow-lg" style={{boxSizing:'border-box'}}>
        <button
          onClick={applyFilters}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded px-4 py-2 font-semibold transition shadow-md"
        >
          Apply Filters
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded px-4 py-2 font-semibold transition shadow-md"
          onClick={() => {
            setShiftTiming("");
            setWorkMode("");
            setHourlyRate("");
            setCreatedAtFilter("");
            setCalendarValue("");
            // Remove all filters from URL
            const params = new URLSearchParams(searchParams?.toString() || "");
            params.delete("shiftTiming");
            params.delete("workMode");
            params.delete("hourlyRate");
            params.delete("createdAtFilter");
            router.push(`/search?${params.toString()}`);
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};
