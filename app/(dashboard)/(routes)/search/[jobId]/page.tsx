import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import JobDetailsPageContent from './_components/job-details-content'
import { getJobs } from '@/actions/get-jobs'
import { Separator } from '@radix-ui/react-dropdown-menu'
import PageContent from '../_components/page-component'
import Box from '../_components/box'

const JobDetailsPage = async({params}:{params:{jobId:string}}) => {
    const job=await db.job.findUnique({
        where:{
            id:params.jobId
        },
        include:{
            company:true
        }
})
    const {userId}=auth()
   if(!job){
    redirect("/search")
   }
   const profile=await db.userProfile.findUnique({
    where:{
        userId:userId as string},
        include:{
          resumes:{
            orderBy:{
                createdAt:"desc"
            }
          }
        }
    }
   )
   const jobs=await getJobs({})
   const filterredJobs=jobs.filter(
    j=>j.id !==job?.id &&j.categoryId===job?.categoryId
   )
  return (
    <div className='flex-col md:p-8 p-4'><JobDetailsPageContent job={job} userProfile={profile} jobId={job.id}/>
    {filterredJobs && filterredJobs.length > 0 && (
        <>
          <Separator/>
          <Box className=" flex-col my-4 items-start px-4 justify-start gap-2">
            <h2 className="text-lg font-semibold">Related Jobs</h2>
          </Box>
          <PageContent 
            jobs={filterredJobs} 
            userId={userId} 
          />
        </>
    )}
   </div > 
  )
}

export default JobDetailsPage