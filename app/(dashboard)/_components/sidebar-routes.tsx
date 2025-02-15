"use client"
import { BookMarked, Compass, Home, HomeIcon, List, User } from "lucide-react"
import { usePathname,useRouter } from "next/navigation"
import SidebarRouteItem from "./side-bar-route-item"
const adminRoutes=[
  {
  icon:List,
  label:"Jobs",
  href:"/admin/jobs"
},
{
  icon:List,
  label:"Comapnies",
  href:"/admin/companies"
},
{
  icon:Compass,
  label:"Analytics",
  href:"/admin/analytics"
}
]
const guestRoutes=[
  {
  icon:Home,
  label:"Home",
  href:"/"
},
{
  icon:Compass,
  label:"Search",
  href:"/search"
},
{
  icon:User,
  label:"Profile",
  href:"/user"
},
{
  icon:BookMarked,
  label:"Saved Jobs",
  href:"/savedJobs"
}
]

const SidebarRoutes = () => {
  const pathname=usePathname()
  const router=useRouter()
  const isAdminPage=pathname?.startsWith("/admin")
  const routes=isAdminPage?adminRoutes:guestRoutes
  return (
    <div className="flex flex-col w-full">
      {routes.map((route)=>(
        <SidebarRouteItem key={route.href} icon={route.icon} label={route.label} href={route.href}/>
      ))}
    </div>
  )
}

export default SidebarRoutes