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
        {/* sidebar routes */}
        <div className="flex flex-col w-full">
              <SidebarRoutes/>
        </div>
        {/* Mode indicator */}
        {!loading && (
          <div className="p-4 text-xs">
            {role === "admin" ? (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin Mode</span>
            ) : (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">Job Seeker Mode</span>
            )}
          </div>
        )}
    </div>
  )
}
