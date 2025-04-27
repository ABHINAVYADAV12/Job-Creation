"use client";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, Copy, Lightbulb, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { Company } from "@prisma/client";
import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";

interface DescriptionFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
});

const DescriptionForm = ({ initialData, companyId }: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error("Something went wrong");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const [industry, setIndustry] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [aiValue, setAiValue] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-gray-800">
        Company Description
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? "Cancel" : <><Pencil className="w-4 h-4 mr-2" /> Edit</>}
        </Button>
      </div>

      {/* Display the description */}
      {!isEditing && (
        <div className={cn("text-sm mt-2 text-black", !initialData.description && "text-neutral-500 italic")}> 
          {!initialData.description ? "No description" : initialData.description}
        </div>
      )}

      {/* Editing Mode */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2 text-gray-800">
            <input
              type="text"
              placeholder="e.g. 'Tech', 'Finance', 'Healthcare'"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="e.g. 'Startup', 'Enterprise'"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            {isPrompting ? (
              <Button>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button type="button" onClick={async () => {
                setIsPrompting(true);
                const prompt = `Write a professional and engaging company description for a ${companyType || 'company'} in the ${industry || 'industry'}. Highlight values, mission, and what makes this company unique.`;
                try {
                  const data = await getGenerativeAIResponse(prompt);
                  setAiValue(data);
                } finally {
                  setIsPrompting(false);
                }
              }}>
                <Lightbulb className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-right text-muted-foreground text-gray-800">
            Note* Request Industry and Company Type for best AI results
          </p>
          {aiValue && (
            <div className="w-full h-48 max-h-48 rounded-md bg-slate-100 overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}
              <Button className="absolute top-3 right-3 z-10" variant="outline" size="icon" onClick={() => {
                navigator.clipboard.writeText(aiValue);
                toast.success("Copied");
              }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 text-gray-800">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'This is all about the company'"
                        value={aiValue || field.value}
                        onChange={e => {
                          setAiValue("");
                          field.onChange(e);
                        }}
                      />
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
        </>
      )}
    </div>
  );
};

export default DescriptionForm;
