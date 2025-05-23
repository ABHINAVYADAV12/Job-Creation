"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"
interface CustomBreadCrumbProps{
  breadCrumbPage:string
  breadCrumbItem?:{link:string,label:string}[]
}
export const CustomBreadCrumb = ({breadCrumbPage,breadCrumbItem}:CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink className="flex items-center justify-center" href="/"><Home className="w-3 h-3 mr-2"/>Home</BreadcrumbLink>
    </BreadcrumbItem>
    {breadCrumbItem &&(
      <>
      {breadCrumbItem.map((item,i)=>(
        <>
        <BreadcrumbSeparator key={i}/>
         <BreadcrumbItem key={i}>
         <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
         </BreadcrumbItem>
        </>
      ))}
      </>
    )}
    <BreadcrumbSeparator/>
    <BreadcrumbItem>
      <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

  )
}

