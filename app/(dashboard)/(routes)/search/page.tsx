
import { getJobs } from "@/actions/get-jobs"
import SearchContainer from "@/components/search-conatiner"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Categories } from "./_components/category-list"
import PageContent from "./_components/page-component"

interface searchProps{
  searchParams:{
    title?:string
    yearsofExperience?:string
    shiftTiming?:string
    createdAtFilter?:string
    workMode?:string
    categoryId?:string
    tag?:string
    hourlyRate?:string
  }
}
const SearchPage =async ({searchParams}:searchProps) => {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
    });
  const {userId}=auth()
  const jobs=await getJobs({
    ...searchParams,
    shiftTiming: searchParams.shiftTiming || undefined,
    workMode: searchParams.workMode || undefined,
    hourlyRate: searchParams.hourlyRate || undefined,
    createdAtFilter: searchParams.createdAtFilter || undefined,
  });
  let filteredJobs = jobs;
  // Tag-based filtering (for legacy jobs if needed)
  if (searchParams.tag) {
    filteredJobs = filteredJobs.filter(job => (job.tags || []).includes(searchParams.tag!));
  }
  console.log(`jobs Count:${filteredJobs.length}`)
  return <>
  <div className="px-6 pt-6 block text-gray-800 md:hidden md:mb-0">
     <SearchContainer/>
  </div>
  <div className="p-6">
    {/* categories */}
    <Categories categories={categories}/>
    {/* page content */}
    <PageContent jobs={filteredJobs} userId={userId}/>
  </div>
  </>
}

export default SearchPage
