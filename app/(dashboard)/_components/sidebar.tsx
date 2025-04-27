"use client"
import Logo from "./logo"
import SidebarRoutes from "./sidebar-routes"
import { useUserRole } from "./use-user-role"

export const Sidebar = () => {
  const { role, loading } = useUserRole();
  return (
    <div className='h-full border-r flex flex-col overflow y-auto bg-white'>
        <div className="p-6">
            <Logo/>
        </div>
        {/* Mode indicator - moved above filters for visibility */}
        {!loading && (
          <div className="p-4 text-xs">
            {role === "admin" ? (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin Mode</span>
            ) : (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">Job Seeker Mode</span>
            )}
          </div>
        )}
        {/* sidebar routes */}
        <div className="flex flex-col w-full">
              <SidebarRoutes/>
        </div>
    </div>
  )
}
