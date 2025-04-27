"use client";
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { CalendarProps } from "react-calendar";

interface SidebarCalendarProps {
  value: Date | null;
  onChangeAction: (date: Date | null) => void;
}

export default function SidebarCalendar({ value, onChangeAction }: SidebarCalendarProps) {
  // react-calendar onChange returns Value (Date | [Date, Date] | null)
  const handleChange: CalendarProps["onChange"] = (val) => {
    if (Array.isArray(val)) {
      onChangeAction(val[0] ?? null);
    } else {
      onChangeAction(val);
    }
  };
  return (
    <div className="w-full max-w-xs bg-white rounded-xl shadow p-2 z-50">
      <Calendar
        value={value || undefined}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
}
