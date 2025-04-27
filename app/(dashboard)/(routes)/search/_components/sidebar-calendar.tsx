"use client";
import { useState } from "react";
import { Calendar } from "@radix-ui/react-calendar";

interface SidebarCalendarProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export default function SidebarCalendar({ value, onChange }: SidebarCalendarProps) {
  return (
    <div className="w-full max-w-xs bg-white rounded-xl shadow p-2 z-50">
      <Calendar
        mode="single"
        selected={value ? value : undefined}
        onSelect={onChange}
        className="w-full"
      />
    </div>
  );
}
