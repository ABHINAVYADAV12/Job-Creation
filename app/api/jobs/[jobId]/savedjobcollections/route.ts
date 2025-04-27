import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const PATCH = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { userId } = auth();
    const { jobId } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("Id is Missing", { status: 401 });
    }
    // Fetch the job by ID only
    const job = await db.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }
    // Add the user to savedUsers only if not already present
    if (job.savedUsers.includes(userId)) {
      return new NextResponse("Already Saved", { status: 200 });
    }
    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        savedUsers: {
          set: [...job.savedUsers, userId],
        },
      },
    });
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.log(`[JOB_SAVE_PATCH]:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};