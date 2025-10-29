"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface Report {
  id: number;
  department: string;
}

export function ManagerDashboard() {
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("/api/reports");
      const data = await response.json();
      const aggregatedData = data.reduce((acc: any, report: Report) => {
        const department = report.department;
        if (!acc[department]) {
          acc[department] = { name: department, reports: 0 };
        }
        acc[department].reports += 1;
        return acc;
      }, {});
      setReportData(Object.values(aggregatedData));
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Department Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={500} height={300} data={reportData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reports" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
}
