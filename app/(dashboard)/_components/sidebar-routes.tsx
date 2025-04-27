"use client"
import { BookMarked, Compass, Home,  List, User, Users } from "lucide-react"
import { useUserRole } from "./use-user-role"
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
  },
  {
    icon:Users,
    label:"Users",
    href:"/admin/users"
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
  const { role, loading } = useUserRole();
  if (loading) return null;
  const isAdmin = role === "admin";
  const routes = isAdmin ? adminRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route)=>(
        <SidebarRouteItem key={route.href} icon={route.icon} label={route.label} href={route.href}/>
      ))}
    </div>
  )
}

export default SidebarRoutes