"use client";

import { RequireAuth } from "@/components/provider/require-auth";
import { AppShell } from "@/components/layouts/app-shell";
import { RepoDashboard } from "@/components/dashboard/repo-dashboard";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <AppShell hideHeader>
        <RepoDashboard />
      </AppShell>
    </RequireAuth>
  );
}
