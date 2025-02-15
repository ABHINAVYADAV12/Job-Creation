"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { title } from "process";
import qs from "query-string"
interface CategoryItemProps{
    label:string;
    value:string
}
const CategoryItem = ({label,value}:CategoryItemProps) => {
    const pathname=usePathname()
    const router=useRouter()
    const searchParams=useSearchParams()
    const currentcategoryId=searchParams.get("categoryId")
    const currenttitle=searchParams.get("title")
    const isSelected=currentcategoryId===value
    const onClick=()=>{
      const url=qs.stringifyUrl({
        url:pathname,
        query:{
            title:currenttitle,
            categoryId:isSelected?null:value
        },  
      }, {skipNull :true,skipEmptyString:true})
      router.push(url)
    }
  return (
        <Button variant={"outline"} type="button" onClick={onClick} className={cn("whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-blue-200 hover:text-white transition cursor-pointer hover:shadow-md",
        isSelected && "bg-blue-500 text-white shadow-md")}>
            {label}
        </Button>)
}

export default CategoryItem