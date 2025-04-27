"use client";
import { Sidebar } from './_components/sidebar'
import {Navbar} from './_components/navbar'
import { usePathname } from 'next/navigation';
import React from 'react';
import ChatBot from './_components/ChatBot';
import AdminChatBot from './_components/AdminChatBot';

const dynamicBgMap: Record<string, string> = {
  '/': 'bg-gradient-to-br from-purple-100 via-blue-50 to-white',
  '/admin/jobs': 'bg-gradient-to-br from-yellow-50 via-white to-orange-100',
  '/admin/companies': 'bg-gradient-to-br from-green-50 via-white to-emerald-100',
  '/admin/users': 'bg-gradient-to-br from-pink-50 via-white to-purple-100',
  '/savedJobs': 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
  '/search': 'bg-gradient-to-br from-indigo-50 via-white to-blue-100',
  '/user': 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
};

function getBgClass(pathname: string) {
  for (const key in dynamicBgMap) {
    if (pathname.startsWith(key)) {
      return dynamicBgMap[key];
    }
  }
  return dynamicBgMap['/'];
}

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  // Always call hooks unconditionally at the top level
  const pathname = usePathname();
  const bgClass = getBgClass(pathname || '/');
  const isAdminPage = pathname?.startsWith('/admin');
  return (
    <div className={`h-full min-h-screen ${bgClass}`}>
        {/*header */}
        <header className='h-20 md:pl-56 fixed inset-y-0 w-full z-50'>
       <Navbar/>
        </header>
        <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
           <Sidebar/>
        </div>
        <main className='md:pl-56 pt-20 h-full'> {children} </main>
        {isAdminPage ? <AdminChatBot /> : <ChatBot />}
    </div>
  )
}

export default DashboardLayout