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

interface ShiftTimingFormProps {
  initialData: Job;
  jobId: string;
}

const options = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
];

const formSchema = z.object({
  shiftTiming: z.string().min(1),
});

const ShiftTimingForm = ({ initialData, jobId }: ShiftTimingFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shiftTiming: initialData?.shiftTiming || "",
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

  const selectedOption = options.find((option) => option.value === initialData.shiftTiming);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-gray-800">
        Job Shift Timing
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* Display shift timing */}
      {!isEditing && (
        <p className={cn("text-sm mt-2 text-gray-800", !initialData?.shiftTiming && "text-neutral-500 italic")}>
          {selectedOption?.label || "No Timing Added"}
        </p>
      )}

      {/* Editing mode */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
            <FormField
              control={form.control}
              name="shiftTiming"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox heading="Timings" options={options} {...field} />
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

export default ShiftTimingForm;
