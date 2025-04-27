"use client"
import { BookMarked, Compass, Home,  List, User, Users } from "lucide-react"
import { useUserRole } from "./use-user-role"
import SidebarRouteItem from "./side-bar-route-item"
import { SidebarFilters } from "../(routes)/search/_components/sidebar-filters";

const adminRoutes=[
  {
    icon:List,
    label:"Jobs",
    href:"/admin/jobs"
  },
  {
    icon:List,
    label:"Companies",
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
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="flex flex-col gap-2">
        {routes.map((route)=>(
          <SidebarRouteItem key={route.href} icon={route.icon} label={route.label} href={route.href}/>
        ))}
      </div>
      {/* Show filters only in job seeker mode (not admin) after Saved Jobs icon */}
      {!isAdmin && (
        <div className="mt-4 w-full">
          <SidebarFilters />
        </div>
      )}
    </div>
  )
}

export default SidebarRoutes