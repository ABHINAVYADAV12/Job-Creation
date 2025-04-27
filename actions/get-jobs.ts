import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs={   
        title?:string
        yearsofExperience?:string
        shiftTiming?:string
        createdAtFilter?:string
        workMode?:string
        savedJobs?:boolean
        categoryId?:string
};
export const getJobs=async({
   title,savedJobs,categoryId 
}:GetJobs):Promise<Job[]>=>{
    const {userId}=auth()
    try{
        // initialise the query object with common options
        const query: {
          where: Record<string, unknown>;
          include: { company: boolean; category: boolean };
          orderBy: { createdAt: "desc" };
        } = {
            where:{
              isPublished:true
            },
            include:{
              company:true,
              category:true
            },
            orderBy:{
             createdAt:"desc"
            }
        } ;
        if(typeof title!=="undefined"||typeof categoryId!=="undefined"){
          query.where={
            AND:[
              { isPublished: true },
              typeof title!=="undefined"&&{
                title:{
                  contains:title,
                  mode:"insensitive"
                }
              },
              typeof categoryId!=="undefined"&&{
                categoryId:{
                  equals:categoryId
                }
              }
            ].filter(Boolean)
          }
        }
        if(savedJobs){
          query.where.savedUsers={
            has:userId
          }
        }
        // execute the query
        const jobs=await db.job.findMany(query);
        return jobs
    }
    catch(error){
      console.log("[GET_JOBS]:",error);
      return []
    }

}
