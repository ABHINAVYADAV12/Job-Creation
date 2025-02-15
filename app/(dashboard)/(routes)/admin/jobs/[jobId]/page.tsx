import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { JobPublishAction } from "./_components/job-publish-action"
import Banner from "@/components/banner"
import { IconBadge } from "@/components/icon-badge"
import TitleForm from "./_components/title-form"
import CategoryForm from "./_components/category-form"
import ImageForm from "./_components/image-form"
import ShortDescription from "./_components/short-description"
import ShiftTimingForm from "./_components/shift-timing-mode"
import HourlyRate from "./_components/job-rate"
import JobMode from "./_components/work-mode"
import WorkExperience from "./_components/work-experience"
import JobDescription from "./_components/job-description"
import CompanyForm from "./_components/company-form"
const JobDetailsPage =async(
    {params} :{params:{jobId: string}})=>{
      //verify mongodb id
      const validObjectIdRegex=/^[0-9a-fA-F]{24}$/
      if(!validObjectIdRegex.test(params.jobId)){
        return redirect("/admin/jobs");
      }
      const {userId}=auth()
      if(!userId){
        return redirect("/")
      }
      const job=await db.job.findUnique({
       where: {
             id:params.jobId,
             userId
        }
      })
      {/*Categories */}
      const categories=await db.category.findMany({
        orderBy:{name: "asc"},
      })
      const companies=await db.company.findMany({
        where:{
          userId
        },
        orderBy:{
         createdAt: "desc"
        },})
      if(!job){
        return redirect("/admin/jobs")
      }
      const requiredFields=[
        job.title,
        job.description,
        job.imageUrl,
        job.categoryId
      ]
      const totalFields=requiredFields.length
      const completedFields=requiredFields.filter(Boolean).length
      const completionText=`(${completedFields}/${totalFields})`
      const isComplete=requiredFields.every(Boolean)
  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}><div className="flex items-center gap-3 text-sm text-neutral-500">
        <ArrowLeft className="w-4 h-4"/>
        Back
        </div> </Link>
        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Job Setup</h1>
            <span className="text-sm text-neutral-500">Complete all fields {completionText}</span>
          </div>
          {/*action button */}
          <JobPublishAction jobId={params.jobId} isPublished={job.isPublished} disabled={!isComplete}/>
        </div>
        {/*warning */}
        {!job.isPublished &&(
         <Banner
           variant={"warning"}
           label="This job is unpublished.It will not be visible in jobs list"
         />
        )
        }
        {/*container layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
             {/*title */}
             <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl text-blue-800">Customize Your Job</h2>
             </div>
             {/*title form */}
             <TitleForm initialData={job} jobId={job.id}/>
             {/*Category Form */}
             <CategoryForm initialData={job} jobId={job.id} options={categories.map(category=>({
              label:category.name,
              value:category.id,
             }))}/>
             {/*image form */}
             <ImageForm initialData={job} jobId={job.id}/>
             {/*short description */}
             <ShortDescription initialData={job} jobId={job.id} />
             <ShiftTimingForm initialData={job} jobId={job.id} />
             <HourlyRate initialData={job} jobId={job.id} />
             {/*work mode */}
             <JobMode initialData={job} jobId={job.id}/>
             <WorkExperience initialData={job} jobId={job.id}/>
          </div>
          {/*Right container */}
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks}/>
              <h2 className="text-xl text-neutral-500" >Comapny Details</h2>
            </div>
            <CompanyForm initialData={job} jobId={job.id} options={companies.map(company=>({
              label:company.name,
              value:company.id,
             }))}/>
          </div>
          {/*description */}
          <div className="col-span-2">
            <JobDescription initialData={job} jobId={job.id}/>
          </div>
        </div>
       </div>
  )
}

export default JobDetailsPage
