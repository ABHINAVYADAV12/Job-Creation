"use client"
import {z} from "zod"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import {useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Lightbulb, Loader, Loader2, Pencil } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { Job } from "@prisma/client"
import { cn } from "@/lib/utils"
import ComboBox from "@/components/ui/combo-box"
import { Textarea } from "@/components/ui/textarea"
import getGenerativeAIResponse from "@/scripts/aistudio"
interface ShortDescriptionProps{
   initialData:Job
   jobId:string
}
const formSchema=z.object({
   short_description:z.string().min(1)
})
const ShortDescription = ({initialData,jobId}:ShortDescriptionProps) => {
    const[isEditing,setIsEditing]=useState(false)

    const [prompt, setPrompt] = useState("")
    const [isPrompting, setIsPrompting] = useState(false)
    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
        short_description :initialData?.short_description||""
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
    const handlePromptGeneration=async()=>{
      try{
       setIsPrompting(true)
       const customPrompt=`Craft a concise job description for a ${prompt} under 400 characters`
       await getGenerativeAIResponse(customPrompt).then((data)=>{
        form.setValue("short_description",data)
        setIsPrompting(false)
       })
      }
      catch(error){
        console.log(error)
        toast.error("Something Went Wrong...")
      }
    }
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between text-gray-800">
            Job Short Description
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing?(<>Cancel</>):(<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
            </Button>
        </div>
     {/*display the short_description */
     }
     {!isEditing &&<p className="text-gray-800">{initialData?.short_description}</p>}
     {/*on editing */}
     { isEditing &&<>
     <div className="flex items-center gap-2 my-2 text-gray-800">
       <input type="text" placeholder="e.g. 'Full Stack Developer'"
       value={prompt} onChange={(e)=>setPrompt(e.target.value)}
       className="w-full p-2 rounded-md"
       />
       {isPrompting?
       <>
       <Button><Loader2 className="W-4 h-4 animate-spin"/></Button>
       </>:<>
       <Button onClick={handlePromptGeneration}>
        <Lightbulb className="W-4 h-4 "/>
       </Button>
       </>}
     </div>
     <p className="text-sm text-right text-muted-foreground text-gray-800">Note* Name is enough</p>
     <Form{...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
        <FormField 
         control={form.control}
          name="short_description"
          render={({field})=>(
            <FormItem>
                <FormControl>
                   <Textarea disabled={isSubmitting} placeholder="Short Description About The Job" {...field}/>
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
     </Form>
     </>}
</div>)}
export default ShortDescription
