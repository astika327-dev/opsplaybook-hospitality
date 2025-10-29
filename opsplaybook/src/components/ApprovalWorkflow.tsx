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

interface ApprovalWorkflowProps {
  reportId: number;
}

export function ApprovalWorkflow({ reportId }: ApprovalWorkflowProps) {
  const [comments, setComments] = useState("");

  const handleApprove = async () => {
    await fetch(`/api/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "approved", comments }),
    });
  };

  const handleReject = async () => {
    await fetch(`/api/reports/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "rejected", comments }),
    });
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
        />
        <div className="flex justify-end w-full space-x-2">
          <Button variant="outline" onClick={handleReject}>
            Request Revision
          </Button>
          <Button onClick={handleApprove}>Approve</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
