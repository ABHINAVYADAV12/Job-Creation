import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = auth();
    const { jobId } = params;

    // Validate user authentication
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate job ID
    if (!jobId) {
      return new NextResponse("Id is Missing", { status: 400 });
    }

    // Fetch the job by ID and userId
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });

    // Check if job exists
    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    // Check if the user has already saved the job
    const userIndex = job.savedUsers.indexOf(userId);
    let updatedJob;

    if (userIndex !== -1) {
      // Remove the user from savedUsers
      updatedJob = await db.job.update({
        where: {
          id: jobId,
        },
        data: {
          savedUsers: {
            set: job.savedUsers.filter((savedUserId) => savedUserId !== userId),
          },
        },
      });
    } else {
      // Add the user to savedUsers
      updatedJob = await db.job.update({
        where: {
          id: jobId,
        },
        data: {
          savedUsers: {
            set: [...job.savedUsers, userId],
          },
        },
      });
    }

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`[JOB_PATCH_ERROR]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
