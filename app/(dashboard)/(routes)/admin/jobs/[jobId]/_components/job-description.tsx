"use client"
import {z} from "zod"
import { useState } from 'react'
import { useRouter } from "next/navigation"
import {useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Copy, Lightbulb, Loader, Loader2, Pencil } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { Job } from "@prisma/client"
import { cn } from "@/lib/utils"
import ComboBox from "@/components/ui/combo-box"
import { Textarea } from "@/components/ui/textarea"
import getGenerativeAIResponse from "@/scripts/aistudio"
import Editor from "@/components/editor"
import Preview from "@/components/preview"
interface JobDescriptionProps{
   initialData:Job
   jobId:string
}
const formSchema=z.object({
    description:z.string().min(1)
})
const JobDescription = ({initialData,jobId}:JobDescriptionProps) => {
    const[isEditing,setIsEditing]=useState(false)
    const [skill, setskillset] = useState("")
    const [rolename, setrolename] = useState("")
    const [aivalue, setaivalue] = useState("")
    const [isPrompting, setIsPrompting] = useState(false)
    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
         description :initialData?. description||""
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
       const customPropmt=`Write a professional and detailed job description for the role of a ${rolename}. The ideal candidate should have expertise in the following skills: 
       ${skill}. Describe key responsibilities, required experience, and any specific qualifications. Additionally, highlight the main objectives and expectations for this role in a way that reflects its importance to the company. Ensure the description is clear, engaging, and aligns with current industry standards.`
       await getGenerativeAIResponse(customPropmt).then((data)=>{
        data=data.replace(/^'|'$/g,"")
        let cleanedText=data.replace(/[\*\#]/g, "")
        // form.setValue("description",cleanedText)
        setaivalue(cleanedText)
        setIsPrompting(false)
       })
      }
      catch(error){
        console.log(error)
        toast.error("Something Went Wrong...")
      }
    }
    const onCopy=()=>{
        navigator.clipboard.writeText(aivalue)
        toast.success("successfully copied")
    }
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between text-gray-800">
            Job Description
            <Button onClick={toggleEditing} variant={"ghost"}>
                {isEditing?(<>Cancel</>):(<><Pencil className="w-4 h-4 mr-2"/>Edit</>)}
            </Button>
        </div>
     {/*display the  description */
     }
     {!isEditing &&
     <div className={cn("text-sm mt-2",!initialData.description && "text-neutral-500 italic")}>
        {!initialData.description &&"no description"}
        {initialData.description &&
        <Preview value={initialData.description}/>
        }
     </div>
    }
     {/*on editing */}
     { isEditing &&<>
     <div className="flex items-center gap-2 my-2 text-gray-800">
       <input type="text" placeholder="e.g. 'Full Stack Developer'"
       value={rolename} onChange={(e)=>setrolename(e.target.value)}
       className="w-full p-2 rounded-md"
       />
        <input type="text" placeholder="e.g. 'full stack'"
       value={skill} onChange={(e)=>setskillset(e.target.value)}
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
     <p className="text-sm text-right text-muted-foreground text-gray-800">Note* Request Skill Set and Profession name</p>
     {aivalue &&(
        <div className="w-full h-96 max-h-96 round-md bg-slate-100 overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
            {aivalue}
            <Button className="absolute top-3 right-3  z-10" variant={"outline"} size={"icon"} onClick={onCopy}>
                <Copy className="w-4 h-4"/>
            </Button>
        </div>
     )}
     <Form{...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
        <FormField 
         control={form.control}
          name="description"
          render={({field})=>(
            <FormItem>
                <FormControl>
                  <Editor {...field}
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
     </Form>
     </>}
</div>)}
export default JobDescription
