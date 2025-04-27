// Usage: node scripts/fix_applied_jobs.js
// This script will update all UserProfile documents in your MongoDB to ensure that the `appliedJobs` field exists and is an array.

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.userProfile.findMany();
  let updatedCount = 0;
  for (const user of users) {
    if (!Array.isArray(user.appliedJobs)) {
      await prisma.userProfile.update({
        where: { userId: user.userId },
        data: { appliedJobs: [] },
      });
      updatedCount++;
      console.log(`Updated user ${user.userId}: set appliedJobs to []`);
    }
  }
  console.log(`Done! Updated ${updatedCount} user profiles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
