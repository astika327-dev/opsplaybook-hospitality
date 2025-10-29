"use client";

import { useSession } from "next-auth/react";
import { StaffDashboard } from "@/components/dashboards/StaffDashboard";
import { SupervisorDashboard } from "@/components/dashboards/SupervisorDashboard";
import { ManagerDashboard } from "@/components/dashboards/ManagerDashboard";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Access Denied</div>;
  }

  const userRole = session?.user?.role;

  return (
    <div>
      {userRole === "staff" && <StaffDashboard />}
      {userRole === "supervisor" && <SupervisorDashboard />}
      {userRole === "manager" && <ManagerDashboard />}
    </div>
  );
}
