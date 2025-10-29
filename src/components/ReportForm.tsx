"use client";

import { useState } from "react";
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

const departmentTemplates = {
  housekeeping: {
    checklists: [
      { id: "clean_rooms", label: "Clean Rooms" },
      { id: "restock_supplies", label: "Restock Supplies" },
      { id: "report_maintenance", label: "Report Maintenance Issues" },
    ],
  },
  "front-desk": {
    checklists: [
      { id: "check_in", label: "Guest Check-in" },
      { id: "check_out", label: "Guest Check-out" },
      { id: "handle_complaints", label: "Handle Complaints" },
    ],
  },
  "f-b": {
    checklists: [
      { id: "kitchen_status", label: "Check Kitchen Status" },
      { id: "inventory_check", label: "Inventory Check" },
      { id: "customer_feedback", label: "Gather Customer Feedback" },
    ],
  },
  maintenance: {
    checklists: [
      { id: "equipment_check", label: "Equipment Checks" },
      { id: "repair_work", label: "Complete Repair Work" },
    ],
  },
};

export function ReportForm() {
  const [department, setDepartment] = useState("housekeeping");
  const [shiftType, setShiftType] = useState("morning");
  const [photos, setPhotos] = useState<string[]>([]);
  const [checklists, setChecklists] = useState<string[]>([]);
  const [issues, setIssues] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
  };

  const handleShiftTypeChange = (value: string) => {
    setShiftType(value);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: reader.result }),
      });
      const data = await response.json();
      setPhotos([...photos, data.url]);
    };
  };

  const handleCheckboxChange = (id: string) => {
    if (checklists.includes(id)) {
      setChecklists(checklists.filter((item) => item !== id));
    } else {
      setChecklists([...checklists, id]);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department,
          shiftType,
          checklists: checklists.map((id) => ({
            task: departmentTemplates[
              department as keyof typeof departmentTemplates
            ].checklists.find((item) => item.id === id)?.label,
            completed: true,
          })),
          issues: [{ description: issues, priority: "low" }],
          photos,
        }),
      });

      if (response.ok) {
        toast.success("Report submitted successfully!");
      } else {
        toast.error("Error submitting report.");
      }
    } catch (error) {
      toast.error("Error submitting report.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentTemplate =
    departmentTemplates[department as keyof typeof departmentTemplates];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Department</Label>
          <Select
            onValueChange={handleDepartmentChange}
            defaultValue={department}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="housekeeping">Housekeeping</SelectItem>
              <SelectItem value="front-desk">Front Desk</SelectItem>
              <SelectItem value="f-b">F&B</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Shift</Label>
          <Select
            onValueChange={handleShiftTypeChange}
            defaultValue={shiftType}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Checklist</Label>
          {currentTemplate.checklists.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                onCheckedChange={() => handleCheckboxChange(item.id)}
                disabled={isLoading}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Label>Issues/Keluhan</Label>
          <Textarea
            placeholder="Enter any issues or complaints..."
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Photo Evidence</Label>
          <Input type="file" onChange={handleFileUpload} disabled={isLoading} />
          <div className="flex space-x-2">
            {photos.map((photo) => (
              <img
                key={photo}
                src={photo}
                alt="Uploaded photo"
                className="w-24 h-24 object-cover"
              />
            ))}
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Report"}
        </Button>
      </CardContent>
    </Card>
  );
}
