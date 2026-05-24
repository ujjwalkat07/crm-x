import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication — CRM",
  description: "Login or create an account to access your CRM dashboard.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4">
      {/* Grid background */}
      <div className="auth-grid" />

      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,0,0,0.03),transparent)]" />

      {children}
    </div>
  );
}
