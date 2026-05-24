"use client";

import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, KeyRound } from "lucide-react";

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname === "/auth/signup" ? "signup" : "login";

  function handleTabChange(value: string) {
    if (value === "login") {
      router.push("/auth/login");
    } else {
      router.push("/auth/signup");
    }
  }

  return (
    <Card className="relative z-10 w-full max-w-[460px] border-border/40 bg-card/95 shadow-xl backdrop-blur-sm">
      <CardContent className="px-8 pt-6 pb-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-2 bg-transparent p-0">
            <TabsTrigger
              value="login"
              className="cursor-pointer gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-0 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-all data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Globe className="size-3.5" />
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="cursor-pointer gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-0 py-2.5 text-sm font-medium text-muted-foreground shadow-none transition-all data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <KeyRound className="size-3.5" />
              Sign Up
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {children}
      </CardContent>
    </Card>
  );
}
