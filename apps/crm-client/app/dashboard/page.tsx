import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — CRM",
  description: "Your CRM dashboard overview.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your CRM dashboard. This page is protected.
        </p>
      </div>
    </div>
  );
}
