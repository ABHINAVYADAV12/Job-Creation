"use client"
import {z} from "zod"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import {useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { Job } from "@prisma/client"
import { cn } from "@/lib/utils"
import ComboBox from "@/components/ui/combo-box"
interface HourlyRateProps{
   initialData:Job
   jobId:string
  
}
const formSchema=z.object({
  hourlyRate:z.string().min(1)
})
const HourlyRate = ({initialData,jobId}:HourlyRateProps) => {
    const[isEditing,setIsEditing]=useState(false)
    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
       hourlyRate :initialData?.hourlyRate||""
        }
    })
    const {isSubmitting,isValid}=form.formState
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            const response=await axios.patch(`/api/jobs/${jobId}`,values)
            toast.success("job updated")
            toggleEditing()
            router.refresh()
        }
        catch(error){
            toast.error("Something went wrong")
        }
    }
    const toggleEditing=()=>setIsEditing((current)=>!current)

    
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between text-gray-800">
            Job Hourly Rate
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing?(<>Cancel</>):(<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
            </Button>
        </div>
     {/*display thehourlyRate */
     }
   {!isEditing && (
  <p className="text-sm mt-2 text-gray-800">
    {initialData.hourlyRate ? `${initialData.hourlyRate}/hr` : "$ 0/hr"}
  </p>
)}

     {/*on editing */}
     { isEditing &&(
     <Form{...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
        <FormField 
         control={form.control}
          name="hourlyRate"
          render={({field})=>(
            <FormItem>
                <FormControl>
                  <Input placeholder="type the hourly rate" disabled={isSubmitting} {...field}/>
                </FormControl>
            </FormItem>
     )}
         />
         <div className="flex items-center gap-x-2 text-gray-800">
            <Button disabled={!isValid||isSubmitting} type="submit">
                Save
            </Button>
         </div>
     </form>
     </Form>)}
    </div>
  )
}

export default HourlyRate
