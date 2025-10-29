"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportForm } from "../ReportForm";

interface Report {
  id: number;
  department: string;
  shiftType: string;
  status: string;
}

export function StaffDashboard() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <ReportForm />
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <ul>
              {reports.map((report) => (
                <li key={report.id}>
                  {report.department} - {report.shiftType} - {report.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no recent reports.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
