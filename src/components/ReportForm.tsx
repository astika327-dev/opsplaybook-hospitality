"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { reportSchema } from "@/lib/validations"; // Menggunakan skema terpusat
import { Trash2 } from "lucide-react";

// Tipe form berdasarkan skema Zod
type ReportFormValues = z.infer<typeof reportSchema>;

// Template checklist yang bisa didapat dari API di masa depan
const departmentTemplates = {
  housekeeping: ["Clean rooms", "Restock supplies", "Report maintenance"],
  "front-desk": ["Guest check-in", "Guest check-out", "Handle complaints"],
  "f-b": ["Check kitchen status", "Inventory check", "Gather feedback"],
  maintenance: ["Equipment checks", "Complete repair work"],
};

export function ReportForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      department: "housekeeping",
      shiftType: "morning",
      checklists: departmentTemplates.housekeeping.map((item) => ({
        item,
        status: "incomplete",
      })),
      issues: [],
      photos: [],
    },
  });

  const {
    fields: issueFields,
    append: appendIssue,
    remove: removeIssue,
  } = useFieldArray({
    control,
    name: "issues",
  });

  const {
    fields: photoFields,
    append: appendPhoto,
    remove: removePhoto,
  } = useFieldArray({
    control,
    name: "photos",
  });

  const selectedDepartment = watch("department");

  const onSubmit = async (data: ReportFormValues) => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Report submitted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit report.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  // Dummy upload handler - di dunia nyata, ini akan mengunggah ke Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Simulasikan unggahan
    toast.info("Uploading image...");
    await new Promise(res => setTimeout(res, 1000)); // Delay palsu
    const fakeUrl = `https://res.cloudinary.com/demo/image/upload/${file.name}`;
    appendPhoto({ url: fakeUrl, caption: "" });
    toast.success("Image uploaded!");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Daily Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Department and Shift */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="housekeeping">Housekeeping</SelectItem>
                      <SelectItem value="front-desk">Front Desk</SelectItem>
                      <SelectItem value="f-b">F&B</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              name="shiftType"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Shift</Label>
                   <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          {/* Checklists */}
          <div>
            <Label className="text-lg font-semibold">Checklist</Label>
            <div className="space-y-2 mt-2">
              {departmentTemplates[selectedDepartment].map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <Controller
                    name={`checklists.${index}.status`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value === "completed"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "completed" : "incomplete")
                        }
                      />
                    )}
                  />
                  <Label>{item}</Label>
                </div>
              ))}
            </div>
             {errors.checklists && (
              <p className="text-sm text-red-500 mt-1">{errors.checklists.message}</p>
            )}
          </div>

          {/* Issues */}
          <div>
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Issues/Keluhan</Label>
              <Button type="button" size="sm" onClick={() => appendIssue({ description: "" })}>
                Add Issue
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {issueFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Textarea
                    {...register(`issues.${index}.description`)}
                    placeholder="Describe the issue..."
                    className="flex-grow"
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeIssue(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
           <div>
            <Label className="text-lg font-semibold">Photo Evidence</Label>
            <Input type="file" onChange={handleFileUpload} className="mt-2" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {photoFields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <img src={field.url} alt={`upload-${index}`} className="rounded-md object-cover aspect-square"/>
                  <div className="flex items-center gap-2">
                     <Input
                      {...register(`photos.${index}.caption`)}
                      placeholder="Caption..."
                      className="flex-grow"
                    />
                     <Button type="button" variant="destructive" size="icon" onClick={() => removePhoto(index)}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
