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
   title,createdAtFilter,shiftTiming,workMode,yearsofExperience,savedJobs,categoryId 
}:GetJobs):Promise<Job[]>=>{
    const {userId}=auth()
    try{
        // initialise the query object with common options
        let query: any={
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