"use client"
import { Ghost, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string";

const SearchContainer = () => {
  const searchParams=useSearchParams()
  const router=useRouter()
  const pathname=usePathname()
  const currentCategoryId=searchParams.get("categoryId")
  const currentTitle=searchParams.get("title")
  const createdAtFilter=searchParams.get("createdAtFilter")
  const currentshiftTiming=searchParams.get("shiftTiming")
  const currentWorkMode=searchParams.get("workMode")
    const  [value, setValue] = useState(currentTitle||"")
    useEffect(() => {
      const url = qs.stringifyUrl({
        url: pathname, // Base URL (path)
        query: {
          categoryId: currentCategoryId,
          title: value || undefined,
          createdAtFilter,
          shiftTiming: currentshiftTiming,
          workMode: currentWorkMode,
        },
      },{
        skipNull:true,
        skipEmptyString:true
      });
      router.push(url);
    }, [value,currentCategoryId,router,pathname,createdAtFilter,currentWorkMode,currentshiftTiming]);
    
  return (
    <div className="flex items-center gap-x-2 relative flex-1">
        <Search className="text-neutral-700 h-4 w-4 absolute left-3"/>
        <Input
         placeholder="Search for a job using title"
         value={value}
         onChange={(e)=>setValue(e.target.value)}
         className="w-full pl-9 rounded-lg bg-blue-200 focus-visible:ring-blue-50 text-sm text-gray-800"
        />
        {
            value &&(
                <Button variant={"ghost"}
                 size={"icon"}
                 type={"button"}   
                 onClick={()=>setValue("")}
                 className="cursor-pointer absolute right-3 hover:scale-125 hover:bg-transparent"
                 >
                  <X className="w-4 h-4" text-gray-800/>
                </Button>
            )}
    </div>
  )
}

export default SearchContainer