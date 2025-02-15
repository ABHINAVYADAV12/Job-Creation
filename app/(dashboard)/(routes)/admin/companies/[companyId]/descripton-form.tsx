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
import { Company } from "@prisma/client"
interface DescriptionFormProps{
   initialData:Company
   companyId:string
}
const formSchema=z.object({
   description:z.string().min(1,{message:"description is required"})
})
const DescriptionForm = ({initialData,companyId}:DescriptionFormProps) => {
    const[isEditing,setIsEditing]=useState(false)
    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            description:initialData?.description||"",
        }
    })
    const {isSubmitting,isValid}=form.formState
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            const response=await axios.patch(`/api/companies/${companyId}`,values)
            toast.success("company updated")
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
            Description Name
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing?(<>Cancel</>):(<><Pencil className="w-4 h-4 mr-2"/>Edit </>)}
            </Button>
        </div>
     {/*display the description */
     }
     {!isEditing &&<p className="text-sm mt-2 text-gray-800">{initialData.description}</p>}
     {/*on editing */}
     { isEditing &&(
     <Form{...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
        <FormField 
         control={form.control}
          name="description"
          render={({field})=>(
            <FormItem>
                <FormControl>
                    <Input 
                    disabled={isSubmitting}
                    placeholder="e.g. 'this is all about company'"
                    {...field}
                    />
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

export default DescriptionForm
