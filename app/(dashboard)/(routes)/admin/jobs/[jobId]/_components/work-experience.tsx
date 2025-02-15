"use client";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import toast from "react-hot-toast";
import axios from "axios";
import { Job } from "@prisma/client";
import { cn } from "@/lib/utils";
import ComboBox from "@/components/ui/combo-box";

interface WorkExperienceProps {
  initialData: Job;
  jobId: string;
}

const option = [
  { value: "0", label: "Fresher" },
  { value: "2", label: "0-2 years" },
  { value: "3", label: "2-4 years" },
  { value: "5", label: "5+ years" },
];

const formSchema = z.object({
  yearsofExperience: z.string().min(1),
});

const WorkExperience = ({ initialData, jobId }: WorkExperienceProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsofExperience: initialData?.yearsofExperience || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);
  const selectedOption = option.find((opt) => opt.value === initialData.yearsofExperience);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-gray-800">
        Job Experience
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* Display the years of experience */}
      {!isEditing && (
        <p className={cn("text-sm mt-2 text-gray-800", !initialData?.yearsofExperience && "text-neutral-500 italic")}>
          {selectedOption?.label || "No Work Experience"}
        </p>
      )}

      {/* Editing mode */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
            <FormField
              control={form.control}
              name="yearsofExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox heading="Work Experience" options={option} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2 text-gray-800">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default WorkExperience;
