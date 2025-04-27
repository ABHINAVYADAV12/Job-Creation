import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string
  yearsofExperience?: string
  shiftTiming?: string
  workMode?: string
  savedJobs?: boolean
  categoryId?: string
  tag?: string
  hourlyRate?: string
  createdAtFilter?: string
};

export const getJobs = async ({
  title, savedJobs, categoryId, tag, shiftTiming, workMode, hourlyRate, createdAtFilter
}: GetJobs): Promise<Job[]> => {
  const { userId } = auth()
  try {
    // DEBUG: Log incoming filters
    console.log('[GET_JOBS] Incoming filters:', {
      title, savedJobs, categoryId, tag, shiftTiming, workMode, hourlyRate, createdAtFilter
    });
    // initialise the query object with common options
    const query: {
      where: Record<string, unknown>;
      include: { company: boolean; category: boolean };
      orderBy: { createdAt: "desc" };
    } = {
      where: {
        isPublished: true
      },
      include: {
        company: true,
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    };
    if (
      typeof title !== "undefined" ||
      typeof categoryId !== "undefined" ||
      typeof tag !== "undefined" ||
      typeof shiftTiming !== "undefined" ||
      typeof workMode !== "undefined" ||
      typeof hourlyRate !== "undefined" ||
      typeof createdAtFilter !== "undefined"
    ) {
      query.where = {
        AND: [
          { isPublished: true },
          typeof title !== "undefined" && {
            title: {
              contains: title,
              mode: "insensitive"
            }
          },
          typeof categoryId !== "undefined" && {
            categoryId: {
              equals: categoryId
            }
          },
          typeof tag !== "undefined" && tag !== '' && {
            tags: {
              has: tag,
              mode: "insensitive"
            }
          },
          typeof shiftTiming !== "undefined" && shiftTiming !== '' && {
            shiftTiming: {
              equals: shiftTiming,
              mode: "insensitive"
            }
          },
          typeof workMode !== "undefined" && workMode !== '' && {
            workMode: {
              equals: workMode,
              mode: "insensitive"
            }
          },
          typeof hourlyRate !== "undefined" && hourlyRate !== '' && {
            hourlyRate: {
              gte: hourlyRate
            }
          },
          typeof createdAtFilter !== "undefined" && createdAtFilter !== '' && {
            createdAt: {
              gte: new Date(createdAtFilter)
            }
          }
        ].filter(Boolean)
      }
      // DEBUG: Log constructed Prisma query
      console.log('[GET_JOBS] Prisma Query:', JSON.stringify(query.where, null, 2));
    }
    if (savedJobs) {
      query.where.savedUsers = {
        has: userId
      }
    }
    // execute the query
    const jobs = await db.job.findMany(query);
    // DEBUG: Log number of jobs returned
    console.log(`[GET_JOBS] Jobs returned: ${jobs.length}`);
    return jobs
  }
  catch (error) {
    console.log("[GET_JOBS]:", error);
    return []
  }

}
