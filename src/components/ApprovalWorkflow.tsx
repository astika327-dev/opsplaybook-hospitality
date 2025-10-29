"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ApprovalWorkflowProps {
  reportId: number;
}

export function ApprovalWorkflow({ reportId }: ApprovalWorkflowProps) {
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved", comments }),
      });

      if (response.ok) {
        toast.success("Report approved successfully!");
      } else {
        toast.error("Error approving report.");
      }
    } catch (error) {
      toast.error("Error approving report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected", comments }),
      });

      if (response.ok) {
        toast.success("Report rejected successfully!");
      } else {
        toast.error("Error rejecting report.");
      }
    } catch (error) {
      toast.error("Error rejecting report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* In a real app, you'd fetch and display the comment history */}
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex-1 p-2 bg-gray-100 rounded-lg">
            <p className="text-sm">
              Please double-check the inventory count in the F&B report.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-end w-full space-x-2">
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? "Rejecting..." : "Request Revision"}
          </Button>
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? "Approving..." : "Approve"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
