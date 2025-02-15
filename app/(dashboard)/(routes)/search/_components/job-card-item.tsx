"use client"

import { Company, Job } from "@prisma/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {motion} from "framer-motion"
import Box from "./box"
import {formatDistanceToNow} from "date-fns"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck, Briefcase, BriefcaseBusiness, Currency, Layers, Loader2, Network } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {truncate} from "lodash"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
interface JobCardItemProps{
  job:Job,
  userId:string|null
}
const experiencedata=[
  {
    value:"0",
    label:"Fresher"
  },
  {
    value:"2",
    label:"0-2 Years"
  },
  {
    value:"3",
    label:"2-4 Years"
  },
  {
    value:"5",
    label:"5+ Years"
  }
  

]
const JobCardItem = ({job,userId}:JobCardItemProps) => {
  const typeJob=job as Job&{
    company:Company|null
  }
  const company=typeJob.company
  const [isBookmarkloading,setIsBookmarkloading]=useState(false);
  const isSavedUser=userId&&job.savedUsers?.includes(userId)
  const SavedUsersicon=isSavedUser?BookmarkCheck:Bookmark;
  const router=useRouter()
  const onClickSaveJob=async()=>{
     try{
       setIsBookmarkloading(true)
       if(isSavedUser){
        await axios.patch(`/api/jobs/${job.id}/removesavedjobs`)
        toast.success("Job Removed")
       }
       else{
        await axios.patch(`/api/jobs/${job.id}/savedjobcollections`)
        toast.success("Job Saved")
       }
       router.refresh()
     }
     catch(error){
       toast.error("Something Went Wrong")
     }
     finally{
      // setIsBookmarkloading(false)
     }
  }
  const getexperiencedlabel=(value:string)=>{
      const experience=experiencedata.find(exp=>exp.value===value)
      return experience? experience.label:"NA"
  }
  return (
    <motion.div layout>
      <Card>
      <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4">
        {/* saved users collection */}
         <Box>
          <p className="text-muted-foreground text-sm">{
            formatDistanceToNow(new Date(job.createdAt),{addSuffix:true})
            }</p>
            <Button variant={"ghost"} size={"icon"}>
              {isBookmarkloading? <Loader2 className="w-4 h-4 animate-spin"/>:
              <div onClick={onClickSaveJob}><SavedUsersicon
              className={cn("w-4 h-4",isSavedUser?"text-emerald-500":"text-muted-foreground")}/></div>
              }
            </Button>
          </Box>
          {/* company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 m-h-12 boeder p-2 rounded-md relative flex items-center justify-center overflow-hidden">
              {company?.logo &&(
                <Image
                alt={company?.name}
                src={company?.logo}
                width={40}
                height={40}
                />
              )}
            </div>
            <div className="w-full">
                <p className="text-stone-700 font-semibold text-base w-full truncate">{job.title}</p>
                <Link href={`/company/${company?.id}`} className="text-xs text-blue-400 w-full truncate">
                  {company?.name}
                </Link>
              </div>
          </Box>
          {/* job details */}
          <Box>
            {job.shiftTiming &&(
              <div className="text-xs text-muted-foreground flex items-center">
               <BriefcaseBusiness className="w-3 h-3 mr-1"/>
               {job.shiftTiming}
              </div>
            )}
             {job.workMode &&(
              <div className="text-xs text-muted-foreground flex items-center">
               <Layers className="w-3 h-3 mr-1"/>
               {job.workMode}
              </div>
            )}
             {job.hourlyRate &&(
              <div className="text-xs text-muted-foreground flex items-center">
               <Currency className="w-3 h-3 mr-1"/>
               {`${job.hourlyRate} $/hr`}
              </div>
            )}
             {job.yearsofExperience &&(
              <div className="text-xs text-muted-foreground flex items-center">
               <Network className="w-3 h-3 mr-1"/>
               {getexperiencedlabel(job.yearsofExperience)}
              </div>
            )}
          </Box>
          {job.short_description&&(
            <CardDescription className="text-xs">
              {truncate(job.short_description,{
                length:180,
                omission:"..."
              })     
              }
            </CardDescription>
          )}
          <Box className="gap-2 mt-auto">
          <Link href={`/search/${job.id}`} className="w-full">
             <Button className="w-full border-blue-500 text-blue-500 hover:bg-transparent hover:text-blue-500"
             variant={"outline"}
             >
              Details
             </Button>
             </Link>
            
             <Button className="w-full text-white  hover:bg-blue-500 bg-blue-800/90 hover:text-white"
             variant={"outline"}
             onClick={onClickSaveJob} 
             >
              {isSavedUser?"saved":"Save For Later"}
             </Button>
          </Box>
      </div>
      </Card>
</motion.div>
  )
}

export default JobCardItem