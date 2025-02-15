"use client"

import { cn } from "@/lib/utils"
interface boxProps{
    children:React.ReactNode,
    className?:string
}
const Box = ({children,className}:boxProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full")}>
        {children}
    </div>
  )
}

export default Box