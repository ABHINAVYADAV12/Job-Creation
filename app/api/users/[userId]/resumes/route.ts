import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Resumes } from "@prisma/client"
import { NextResponse } from "next/server"
import { json } from "stream/consumers"

export const POST=async(req: Request)=>{
    try{
      const {userId}=auth()
      if(!userId){
        return new NextResponse("Un-authorize",{status:401})}
        const {resumes}=await req.json()
        if(!resumes||!Array.isArray(resumes)||resumes.length===0){
            return new NextResponse("Invalid Resume Format",{status:400})
        }
       const createdresumes:Resumes[]=[]
       for (const resume of resumes){
        const {url,name}=resume 
        const existingResume=await db.resumes.findFirst({
            where:{
            userProfileId:userId,
            url,
            
            }
        })
        if(existingResume){console.log(`Resume with URL ${url} already exist for resumeId ${userId}`)
            continue}
        const createdResume=await db.resumes.create({
            data:{
                url,
                name,
                userProfileId:userId,
            }
        })
        createdresumes.push(createdResume)
       }
       return NextResponse.json(createdresumes)
      }
    catch(error){
        console.log(`[USER_RESUME_POST]:${error}`)
        return new NextResponse("Internal Server Error",{status :500})
    }
}