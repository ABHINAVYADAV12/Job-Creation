"use client"

import { Job } from "@prisma/client"
import Image from "next/image"
import {AnimatePresence,motion} from "framer-motion"
import JobCardItem from "./job-card-item"
import { fadeInOut } from "@/animations"
interface PageContentProps{
    jobs:Job[]
    userId:string|null
}
const PageContent = ({jobs,userId}:PageContentProps) => {
  if(jobs.length===0){
    return(
        <div className="flex items-center justify-center flex-col">
            <div className="w-full h-[60vh] relative flex items-center justify-center">
               <Image
               fill
               alt="Not Found"
               src={"/img/HEIF Image.png"}
               className="w-full h-full object-contain"
               />
            </div>
            <h2 className="text-4xl font-semibold text-muted-foreground">No Job Found</h2>
        </div>
    )
  }
  return(
    <div>
        <AnimatePresence>
           <motion.div 
           {...fadeInOut}
           layout 
           className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
            {
                jobs.map(job=>(
                    <JobCardItem key={job.id}
                    job={job} userId={userId}
                    />
                ))
            }
           </motion.div>
        </AnimatePresence>
    </div>
  )
}

export default PageContent