import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { jobId } = req.query;
  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).json({ message: 'Invalid job ID' });
  }

  try {
    const applicants = await db.application.findMany({
      where: { jobId },
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = applicants.map(app => ({
      id: app.userId,
      fullName: app.user?.fullName || '',
      email: app.user?.email || '',
      resumeUrl: app.resumeUrl || '',
      appliedAt: app.createdAt
    }));
    return res.status(200).json(formatted);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
}
