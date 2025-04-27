"use client"

import { Resumes, UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import Box from "@/app/(dashboard)/(routes)/search/_components/box";
import Link from "next/link";
import { Button } from "./button";

interface ApplyModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onConfirmAction: () => void;
    loading: boolean;
    userProfile: UserProfile & { resumes: Resumes[] } | null;
  }
  
  export const ApplyModal = ({
    isOpen,
    onCloseAction,
    onConfirmAction,
    loading,
    userProfile,
  }: ApplyModalProps) => {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    if (!isMounted) {
      return null;
    }
  
    return (
      <Modal
        title="Apply for this Job"
        description="Please confirm your details before applying."
        isOpen={isOpen}
        onClose={onCloseAction}
      >
        <Box>
  <div className="grid grid-cols-2 gap-4 w-full bg-white p-4 rounded-lg shadow-md">
    <label className="p-3 border rounded-md bg-gray-50 text-gray-800 font-semibold flex items-center gap-2">
      <span className="w-24 text-gray-500">Name:</span>
      <span className="truncate">{userProfile?.fullName || <span className='italic text-gray-400'>N/A</span>}</span>
    </label>
    <label className="p-3 border rounded-md bg-gray-50 text-gray-800 font-semibold flex items-center gap-2">
      <span className="w-24 text-gray-500">Contact:</span>
      <span className="truncate">{userProfile?.contact || <span className='italic text-gray-400'>N/A</span>}</span>
    </label>
    <label className="p-3 border rounded-md col-span-2 bg-gray-50 text-gray-800 font-semibold flex items-center gap-2">
      <span className="w-24 text-gray-500">Email:</span>
      <span className="truncate">{userProfile?.email || <span className='italic text-gray-400'>N/A</span>}</span>
    </label>
    <label className="p-3 border rounded-md col-span-2 flex items-center gap-2 whitespace-nowrap bg-gray-50 text-gray-800 font-semibold">
      <span className="w-32 text-gray-500">Active Resume:</span>
      <span className="text-purple-700 w-full truncate">
        {userProfile?.resumes.find(
          (resume) => resume.id === userProfile?.activeResumeId
        )?.name || <span className='italic text-gray-400'>No Resume Selected</span>}
      </span>
    </label>
    <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground mt-2">
      Change your details
      <Link href="/user" className="text-purple-700 ml-2 underline underline-offset-2">
        here
      </Link>
    </div>
  </div>
</Box>
<div className="pt-6 space-x-2 flex items-center justify-end w-full">
  <Button disabled={loading} variant="outline" onClick={onCloseAction} className="px-6 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100">
    Cancel
  </Button>
  <Button
    disabled={loading}
    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 active:scale-95"
    onClick={onConfirmAction}
  >
    Apply Now
  </Button>
</div>

      </Modal>
    );
  };