"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportForm } from "../ReportForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Tipe ini perlu disinkronkan dengan respons API yang baru
interface Report {
  id: number;
  department: string;
  shiftType: string;
  status: string;
  createdAt: string; // ISO string
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  submitted: "default",
  approved: "secondary",
  rejected: "destructive",
  needs_revision: "outline",
};


export function StaffDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reports");
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Grid untuk layout yang lebih baik di layar besar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ReportForm />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading reports...</p>
              ) : reports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{report.department}</TableCell>
                        <TableCell>{report.shiftType}</TableCell>
                        <TableCell className="text-right">
                           <Badge variant={statusVariantMap[report.status] || "default"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>You have no recent reports.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
