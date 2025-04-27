import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const POST=async(req: Request)=>{
    try{
      const {userId}=auth()
      const {title, categoryId}=await req.json()
      if(!userId){
        return new NextResponse("Un-authorize",{status:401})
      }
      if(!title){
        return new NextResponse("Title is missing",{status:401})
      }
      if(categoryId && !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return new NextResponse("Invalid category ID format",{status:400})
      }
      const job=await db.job.create({
        data:{
            userId,
            title,
            ...(categoryId && { categoryId })
        }
      })
      return NextResponse.json(job)
    }

    catch(error){
        console.log(`[JOB_POST]:${error}`)
        return new NextResponse("Internal Server Error",{status :500})
    }
}
