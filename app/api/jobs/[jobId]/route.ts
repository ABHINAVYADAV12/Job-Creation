import { storage } from "@/config/firebase.config"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { deleteObject, ref } from "firebase/storage"
import { NextResponse } from "next/server"

export const PATCH=async(req: Request,{params}:{params:{jobId: string}})=>{
    try{
      const {userId}=auth()
      const {jobId}=params
      const updatedValues=await req.json()
      if(!userId){
        return new NextResponse("Un-authorize",{status:401})
      }
      if(!jobId){
        return new NextResponse("Id Is missing",{status:401})
      }
      const job=await db.job.update({
       where:{
        id:jobId,
        userId
       },
       data:{
        ...updatedValues
       }
      })
      // Always return the updated job, including tags
      return NextResponse.json(job)
    }

    catch(error){
        console.log(`[JOB_PATCH]:${error}`)
        return new NextResponse("Internal Server Error",{status :500})
    }
}

// GET job details (including tags)
export const GET = async (req: Request, { params }: { params: { jobId: string } }) => {
  try {
    const { userId } = auth();
    const { jobId } = params;
    if (!userId) {
      return new NextResponse("Un-authorize", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("Id Is missing", { status: 401 });
    }
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId
      }
    });
    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_GET]:${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// delete the job
export const DELETE=async(req: Request,{params}:{params:{jobId: string}})=>{
  try{
    const {userId}=auth()
    const {jobId}=params
    if(!userId){
      return new NextResponse("Un-authorize",{status:401})
    }
    if(!jobId){
      return new NextResponse("Id Is missing",{status:401})
    }
  const job=await db.job.findUnique({
     where:{
       id:jobId,
       userId
     },
  })
  if(!job){
    return new NextResponse("Job Not Found",{status:404})
  }
  if(job.imageUrl){
    const storageRef=ref(storage,job.imageUrl);
    await deleteObject(storageRef)
  }
  const deletejob=await db.job.delete({
    where:{
      id:jobId,
      userId
    },
 })
  return NextResponse.json(deletejob)
  }

  catch(error){
      console.log(`[JOB_DELETE]:${error}`)
      return new NextResponse("Internal Server Error",{status :500})
  }
}