import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming you have a db instance for Prisma or similar
import { auth } from '@clerk/nextjs/server';

export const PATCH = async (req: Request) => {
  try {
   const {userId}=auth()
    const jobId  = await req.json();

    // Check for userId
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check for jobId
    if (!jobId) {
      return new NextResponse('Job ID is missing', { status: 400 });
    }

    // Find the user profile based on the userId
    const profile = await db.userProfile.findUnique({
      where: { userId },
    });

    // If the profile doesn't exist
    if (!profile) {
      return new NextResponse('User Profile Not found', { status: 404 });
    }

    // Update the appliedJobs array with the new jobId
    const updatedProfile = await db.userProfile.update({
      where: { userId },
      data: {
        appliedJobs: {
          push: {jobId},
        },
      },
    });

    // Return the updated profile as a JSON response
    return NextResponse.json(updatedProfile);

  } catch (error) {
    console.error('[JOB_APPLIED_JOBS_PATCH]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
