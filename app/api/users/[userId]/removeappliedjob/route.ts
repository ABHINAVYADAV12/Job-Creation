import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export const PATCH = async (req: Request) => {
  try {
    const { userId } = auth();
    const { jobId } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!jobId) {
      return new NextResponse('Job ID is missing', { status: 400 });
    }

    const profile = await db.userProfile.findUnique({ where: { userId } });
    if (!profile) {
      return new NextResponse('User Profile Not found', { status: 404 });
    }

    // Remove the application from the Application table
    await db.application.deleteMany({
      where: { userId, jobId },
    });

    // Optionally, you can also update the userProfile.appliedJobs array for legacy support, but it's not required.

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[JOB_REMOVE_APPLIED_PATCH]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
