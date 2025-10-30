"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Report } from "./page"; // Impor tipe data
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  submitted: "default",
  approved: "secondary",
  rejected: "destructive",
  needs_revision: "outline",
};

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "user.name",
    header: "Staff",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "shiftType",
    header: "Shift",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariantMap[row.original.status] || "default"}>
        {row.original.status}
      </Badge>
    ),
  },
];
