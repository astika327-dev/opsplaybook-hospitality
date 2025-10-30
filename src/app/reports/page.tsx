"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { columns } from "./columns"; // Definisikan kolom tabel
import { DataTable } from "./data-table"; // Komponen tabel yang dapat digunakan kembali

// Definisikan tipe data yang sesuai dengan respons API
export interface Report {
  id: number;
  user: {
    name: string;
  };
  department: string;
  shiftType: string;
  status: string;
  createdAt: string;
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      if (session) {
        setIsLoading(true);
        try {
          const res = await fetch("/api/reports");
          const data = await res.json();
          setReports(data);
        } catch (error) {
          console.error("Failed to fetch reports:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchReports();
  }, [session]);

  if (isLoading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">All Reports</h1>
      <DataTable columns={columns} data={reports} />
    </div>
  );
}
