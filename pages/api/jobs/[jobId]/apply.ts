import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { jobId } = req.query;
  const { userId, resumeUrl } = req.body;

  if (!jobId || typeof jobId !== 'string' || !userId) {
    return res.status(400).json({ message: 'Missing jobId or userId' });
  }

  try {
    // Prevent duplicate applications
    const existing = await db.application.findFirst({
      where: { jobId, userId },
    });
    if (existing) {
      return res.status(409).json({ message: 'Already applied' });
    }
    // Debug logging
    console.log('Creating application:', { jobId, userId, resumeUrl });
    const application = await db.application.create({
      data: {
        jobId,
        userId,
        resumeUrl: resumeUrl || null,
      },
    });
    console.log('Application created:', application);
    return res.status(201).json(application);
  } catch (error) {
    console.error('Error in /apply:', error);
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : error });
  }
}
