import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assuming you have a db instance for Prisma or similar
import { auth } from '@clerk/nextjs/server';
import { sendMail } from '@/lib/mailer';

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

    // Initialize appliedJobs if it doesn't exist
    if (!profile.appliedJobs) {
      await db.userProfile.update({
        where: { userId },
        data: { appliedJobs: [] },
      });
    }

    // Update the appliedJobs array with the new jobId and appliedAt
    try {
      const jobIdValue = typeof jobId === 'object' && jobId.jobId ? jobId.jobId : jobId;
      const updatedProfile = await db.userProfile.update({
        where: { userId },
        data: {
          appliedJobs: {
            push: { jobId: jobIdValue, appliedAt: new Date() },
          },
        },
      });

      // Fetch job and user info for email
      const job = await db.job.findUnique({ where: { id: jobIdValue } });
      const user = await db.userProfile.findUnique({ where: { userId } });
      if (job && user && user.email) {
        await sendMail({
          to: user.email,
          subject: `Job Application Confirmation: ${job.title}`,
          html: `<p>Hello ${user.fullName || ''},</p><p>You have successfully applied for the job: <b>${job.title}</b>.</p><p>Thank you for using our portal!</p>`,
          text: `Hello ${user.fullName || ''},\nYou have successfully applied for the job: ${job.title}.\nThank you for using our portal!`,
        });
      }

      return NextResponse.json(updatedProfile);
    } catch (updateError) {
      console.error('[JOB_APPLIED_JOBS_PATCH_UPDATE]:', updateError);
      return new NextResponse('Failed to update appliedJobs', { status: 500 });
    }

  } catch (error) {
    console.error('[JOB_APPLIED_JOBS_PATCH]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};
