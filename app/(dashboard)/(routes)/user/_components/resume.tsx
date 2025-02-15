"use client"

import { ResumeUpload } from "@/components/Resume-Uploads";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Resumes, UserProfile } from "@prisma/client"
import axios from "axios";
import { File, Loader2, PlusCircle, ShieldCheck, ShieldX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, useForm,FormProvider } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface resumeFormProps{
    initialData:(UserProfile&{resumes:Resumes[]})|null;
    userId:string
}
const formSchema=z.object({resumes:z.object({url:z.string(),name:z.string()}).array()})


const ResumeForm = ({initialData,userId}:resumeFormProps) => {
  
    const [isEditing,setIsEditing]=useState(false)
    const [deletingId,setDeletingId]=useState<string|null>(null)
    const [isActiveResumeId, setIsActiveResumeId] = useState<string|null>(null)
    const router=useRouter()
    const setActiveResumeId = async (resumeId: string) => {
      try {
        setIsActiveResumeId(resumeId);
    
        // Make the API request to update the user profile
        const response = await axios.patch(`/api/users/${userId}`, {
          activeResumeId: resumeId,
        });
    
        // Show success toast
        toast.success('Resume Activated');
        router.refresh();
      } catch (error) {
        // Handle error and show toast
        console.error((error as Error)?.message);
        toast.error('Failed to activate resume');
      }
      finally{
        setIsActiveResumeId(null)
      }
    };
    // Assuming initialData is available and has a type of `any`
const initialResumes = Array.isArray(initialData?.resumes)
? initialData.resumes.map((resume: any) => {
    if (
      typeof resume === "object" &&
      resume !== null &&
      "url" in resume &&
      "name" in resume
    ) {
      return { url: resume.url, name: resume.name };
    }
    // Provide default values if the resume does not match the expected shape
    return { url: "", name: "" };
  })
: [];

// Using React Hook Form with Zod schema validation
const form = useForm<z.infer<typeof formSchema>>({
resolver: zodResolver(formSchema),
defaultValues: {
  resumes: initialResumes,
},
});

    const {isSubmitting,isValid}=form.formState
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
      console.log(values)
      try{
       const response=await axios.post(
        `/api/users/${userId}/resumes`,values
       )
       toast.success("Resume Added")
       toggleEditing()
       router.refresh()
      }
      catch(error){
        console.log((error as Error)?.message)
        toast.error("Something Went Wrong")
      }

    }
    const toggleEditing=()=>setIsEditing((current)=>!current)
    const onDelete=async(resume:Resumes)=>{
      try{
        setDeletingId(resume.id)
        await axios.delete(`/api/users/${userId}/resumes/${resume.id}`)
        toast.success("Resume removed")
        router.refresh()
      }
      catch(error){
        console.log((error as Error)?.message)
        toast.error("Something Went Wrong")
      }
    }
    return (
        <div className="mt-6 border flex-1 w-full rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
            Your Resumes
            <Button onClick={toggleEditing} variant="ghost">
              {isEditing?(
                <>Cancel</>
              ):(
                <>
                <PlusCircle className="w-4 h-4 mr-2"/>
                Add a File
                </>
              )}
            </Button>
            </div>
            {!isEditing&&(
                 <div className="space-y-2">
               {initialData?.resumes.map((item)=>(
                <div className="grid grid-cols-12">
                <div
                key={item.url}
                className="p-3 w-full bg-blue-100 border-blue-200 border text-purple-700 rounded-md flex items-center col-span-10"
                >
                  <File className="w-4 h-4 mr-2"/>
                  <p className="text-xs w-full truncate"> {item.name}</p>
                  {deletingId===item.id&&(
                    <Button
                    variant="ghost" size={"icon"}className="p-1"
                    onClick={()=>{onDelete(item)}} type="button"
                    >
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    </Button>
                  )}
                   {deletingId!==item.id&&(
                    <Button
                    variant="ghost" size={"icon"}className="p-1"
                    onClick={()=>{onDelete(item)}} type="button"
                    >
                    <X className="h-4 w-4 "/>
                    </Button>
                  )}
                 
                </div>
                <div className=" col-span-1 flex items-center justify-start">
                {isActiveResumeId === item.id ? (
  <div className="flex items-center justify-center w-full">
    <Loader2 className="w-4 h-4 animate-spin" />
  </div>
) : (
  <Button
    variant="ghost"
    className={cn(
      "flex items-center justify-center",
      initialData.activeResumeId=== item.id ? "text-emerald-500" : "text-red-500" 
    )} onClick={()=>setActiveResumeId(item.id)}
  >
    <p>
      {initialData.activeResumeId === item.id ? "Live" : "Activate"}
    </p>
    {initialData.activeResumeId === item.id ? (
      <ShieldCheck className="w-4 h-4 ml-2" />
    ) : (
      <ShieldX className="w-4 h-4 ml-2" />
    )}
  </Button>
)}


                </div>
              </div>
               ))}
                </div>
            )}
            {isEditing &&(
              <FormProvider {...form}>
             <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} className="space y-4 mt-4">
               <FormField
                 control={form.control}
                 name="resumes"
                 render={({ field }) => (
                   <FormItem>
                     <FormControl>
                       <ResumeUpload
                         value={field.value}
                         disabled={isSubmitting}
                         onChange={(resumes) => {
                           if (resumes) {
                             onSubmit({resumes})
                           }
                         }}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <div className="flex item-center gap-x-2">
                 <Button disabled={!isValid || isSubmitting} type="submit">
                   Save
                 </Button>
               </div>
             </form>
           </Form>
           </FormProvider>
            )}
        </div>
     )
}

export default ResumeForm;