"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";
import {
  Loader2,
  Users,
  UserCheck,
  CheckCircle,
  RefreshCw,
  FolderMinus,
  Briefcase,
  Layers,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadItem {
  id: string;
  customerName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: "Open" | "Active" | "Closed" | "Lost";
  priority: "HIGH" | "MEDIUM" | "LOW";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AnalyticsPage() {
  const [realLeads, setRealLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "6m">("6m");
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch real leads
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/leads");
      const fetchedData = res.data.data || res.data;

      const mapped = fetchedData.map((lead: any) => ({
        id: lead.id,
        customerName: lead.customerName || "Unnamed Lead",
        email: lead.email || null,
        phone: lead.phone || null,
        company: lead.company || null,
        status: lead.status || "Open",
        priority: lead.priority || "MEDIUM",
        tags: lead.tags || [],
        createdAt: lead.createdAt || new Date().toISOString(),
        updatedAt: lead.updatedAt || new Date().toISOString(),
      }));

      setRealLeads(mapped);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load lead analytics data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Sync / Refresh handler
  const handleRefresh = async () => {
    setIsSyncing(true);
    await fetchLeads();
    setTimeout(() => setIsSyncing(false), 500);
  };

  // Date filters based on timeframe
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeframe === "7d") {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeframe === "30d") {
      cutoff.setDate(now.getDate() - 30);
    } else {
      cutoff.setMonth(now.getMonth() - 6);
    }

    return realLeads.filter(
      (lead) => new Date(lead.createdAt) >= cutoff && new Date(lead.createdAt) <= now,
    );
  }, [realLeads, timeframe]);

  // KPI Calculations
  const metrics = useMemo(() => {
    const totalCurrent = filteredLeads.length;

    // Active leads (Open & Active stages)
    const activeCurrent = filteredLeads.filter(
      (l) => l.status === "Active" || l.status === "Open",
    ).length;

    // Won leads (Closed stage)
    const wonCurrent = filteredLeads.filter((l) => l.status === "Closed").length;

    // Lost leads
    const lostCurrent = filteredLeads.filter((l) => l.status === "Lost").length;

    // Conversion rate: Won / (Won + Lost) or Won / Total
    const totalResolvedCurrent = wonCurrent + lostCurrent;

    const conversionRateCurrent =
      totalResolvedCurrent > 0
        ? (wonCurrent / totalResolvedCurrent) * 100
        : totalCurrent > 0
          ? (wonCurrent / totalCurrent) * 100
          : 0;

    return {
      totalLeads: {
        value: totalCurrent,
      },
      activeLeads: {
        value: activeCurrent,
      },
      wonLeads: {
        value: wonCurrent,
      },
      lostLeads: {
        value: lostCurrent,
      },
      conversionRate: {
        value: parseFloat(conversionRateCurrent.toFixed(1)),
      },
    };
  }, [filteredLeads]);

  // 1. Time Series Chart Data (Area Chart)
  const timeSeriesData = useMemo(() => {
    const result: Record<string, { name: string; leads: number; won: number }> = {};

    const now = new Date();

    if (timeframe === "7d") {
      // Initialize past 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toLocaleDateString("en-US", { weekday: "short" });
        result[key] = { name: key, leads: 0, won: 0 };
      }

      filteredLeads.forEach((lead) => {
        const date = new Date(lead.createdAt);
        const key = date.toLocaleDateString("en-US", { weekday: "short" });
        const entry = result[key];
        if (entry) {
          entry.leads += 1;
          if (lead.status === "Closed") entry.won += 1;
        }
      });
    } else if (timeframe === "30d") {
      // Initialize weekly groups for 30d
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      weeks.forEach((w) => {
        result[w] = { name: w, leads: 0, won: 0 };
      });

      filteredLeads.forEach((lead) => {
        const date = new Date(lead.createdAt);
        const daysAgo = Math.floor(
          (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000),
        );
        let key = "Week 4";
        if (daysAgo >= 21) key = "Week 1";
        else if (daysAgo >= 14) key = "Week 2";
        else if (daysAgo >= 7) key = "Week 3";

        const entry = result[key];
        if (entry) {
          entry.leads += 1;
          if (lead.status === "Closed") entry.won += 1;
        }
      });
    } else {
      // Initialize past 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString("en-US", { month: "short" });
        result[key] = { name: key, leads: 0, won: 0 };
      }

      filteredLeads.forEach((lead) => {
        const date = new Date(lead.createdAt);
        const key = date.toLocaleDateString("en-US", { month: "short" });
        const entry = result[key];
        if (entry) {
          entry.leads += 1;
          if (lead.status === "Closed") entry.won += 1;
        }
      });
    }

    return Object.values(result);
  }, [filteredLeads, timeframe]);

  // 2. Status Distribution (Pie/Donut Chart)
  const statusData = useMemo(() => {
    const counts = { Open: 0, Active: 0, Closed: 0, Lost: 0 };
    filteredLeads.forEach((lead) => {
      if (counts[lead.status] !== undefined) {
        counts[lead.status] += 1;
      }
    });

    return [
      { name: "New (Open)", value: counts.Open, color: "#f59e0b" }, // Amber
      { name: "Engaged (Active)", value: counts.Active, color: "#6366f1" }, // Indigo
      { name: "Closed Won", value: counts.Closed, color: "#10b981" }, // Emerald
      { name: "Closed Lost", value: counts.Lost, color: "#f43f5e" }, // Rose
    ].filter((item) => item.value > 0);
  }, [filteredLeads]);

  // 3. Priority Distribution (Bar Chart)
  const priorityData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    filteredLeads.forEach((lead) => {
      if (counts[lead.priority] !== undefined) {
        counts[lead.priority] += 1;
      }
    });

    return [
      { name: "High", value: counts.HIGH, color: "#ef4444" },
      { name: "Medium", value: counts.MEDIUM, color: "#f59e0b" },
      { name: "Low", value: counts.LOW, color: "#3b82f6" },
    ];
  }, [filteredLeads]);

  // 4. Company Performance Table (Processed)
  const companyData = useMemo(() => {
    const stats: Record<string, { company: string; total: number; won: number }> = {};

    filteredLeads.forEach((lead) => {
      const co = lead.company || "Unknown";
      if (!stats[co]) {
        stats[co] = { company: co, total: 0, won: 0 };
      }
      stats[co].total += 1;
      if (lead.status === "Closed") {
        stats[co].won += 1;
      }
    });

    return Object.values(stats)
      .map((item) => ({
        ...item,
        conversion: item.total > 0 ? Math.round((item.won / item.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Limit to top 5
  }, [filteredLeads]);

  // Chart configuration for shadcn style helper
  const areaChartConfig = {
    leads: {
      label: "New Leads",
      color: "oklch(0.585 0.233 277.11)", // Indigo
    },
    won: {
      label: "Closed Won",
      color: "oklch(0.643 0.207 142.73)", // Emerald
    },
  };

  const donutChartConfig = {
    value: {
      label: "Leads",
    },
  };

  // Render Loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Render Empty State if no real leads exist in the database
  if (!loading && realLeads.length === 0) {
    return (
      <div className="p-6 md:p-8 space-y-6 relative min-h-[85vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">No Lead Data Found</h1>
          <p className="text-muted-foreground text-sm">
            It looks like there are no leads in your CRM. Add some leads first to start analyzing metrics on your dashboard.
          </p>
          <div className="pt-2">
            <Button asChild className="cursor-pointer">
              <Link href="/leads">Go to Leads</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 relative min-h-screen">
      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analyze lead ingestion channels, status conversions, and team sales pipeline.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe pill selector */}
          <div className="inline-flex rounded-lg p-1 bg-muted/60 border border-border">
            {[
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "6m", label: "6 Months" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${timeframe === tab.id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh / Sync Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading || isSyncing}
            className="border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg h-9 w-9 cursor-pointer"
            title="Refresh lead statistics"
          >
            <RefreshCw
              className={`w-4 h-4 ${isSyncing || loading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Leads */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group p-4 border border-border/80">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Total Leads
            </CardTitle>
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-black tracking-tight">
              {metrics.totalLeads.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Active Leads */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group p-4 border border-border/80">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Active Leads
            </CardTitle>
            <div className="w-7 h-7 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-black tracking-tight">
              {metrics.activeLeads.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Closed Won */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group p-4 border border-border/80">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Closed Won
            </CardTitle>
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-black tracking-tight">
              {metrics.wonLeads.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Closed Lost */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group p-4 border border-border/80">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Closed Lost
            </CardTitle>
            <div className="w-7 h-7 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-500">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-black tracking-tight">
              {metrics.lostLeads.value.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* KPI 5: Conversion Rate */}
        <Card className="hover:shadow-md transition-shadow relative overflow-hidden group p-4 border border-border/80">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
          <CardHeader className="flex flex-row items-center justify-between p-0 pb-1.5 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <div className="w-7 h-7 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-500">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-2xl font-black tracking-tight">
              {metrics.conversionRate.value}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Leads Over Time (2/3 width) */}
        <Card className="lg:col-span-2 shadow-xs border border-border">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Lead Acquisition Trend</CardTitle>
              <CardDescription>
                Ingested leads and successful conversions over time.
              </CardDescription>
            </div>
            {/* Legend indicators */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500" />
                <span className="text-muted-foreground">New Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500" />
                <span className="text-muted-foreground">Closed Won</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[320px] px-2 sm:px-6">
            {filteredLeads.length === 0 ? (
              <div className="w-full h-full bg-muted/20 border border-dashed border-border/80 rounded-lg flex flex-col items-center justify-center text-center p-6">
                <FolderMinus className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-xs font-semibold">No Leads in Selected Timeframe</p>
                <p className="text-[10px] text-muted-foreground max-w-xs mt-1">
                  There are no leads created in the past {timeframe === "7d" ? "7 days" : timeframe === "30d" ? "30 days" : "6 months"}.
                </p>
              </div>
            ) : (
              <ChartContainer config={areaChartConfig} className="w-full h-full min-h-[300px]">
                <AreaChart
                  data={timeSeriesData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-leads)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--color-leads)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-won)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--color-won)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => Math.round(val).toString()}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="var(--color-leads)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                  <Area
                    type="monotone"
                    dataKey="won"
                    stroke="var(--color-won)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorWon)"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart: Status Distribution (1/3 width) */}
        <Card className="shadow-xs border border-border flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Status Segmentation</CardTitle>
            <CardDescription>Pipeline distribution across operational stages.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pb-6">
            {statusData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/80 rounded-lg min-h-[180px]">
                <FolderMinus className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-xs font-semibold">No Segmented Leads</p>
                <p className="text-[10px] text-muted-foreground">
                  Try broadening your timeframe filters or add some lead records.
                </p>
              </div>
            ) : (
              <>
                {/* Recharts Donut Pie */}
                <div className="relative w-full h-[180px] flex items-center justify-center">
                  <ChartContainer config={donutChartConfig} className="w-full h-full max-h-[170px] max-w-[170px]">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  {/* Central Text HUD */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black">
                      {filteredLeads.length}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Total Leads
                    </span>
                  </div>
                </div>

                {/* Customized Color Legends */}
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  {statusData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-1.5 border border-border/40 p-2 rounded-lg bg-muted/10"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-medium truncate leading-none">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-foreground mt-0.5 leading-none">
                          {item.value}{" "}
                          <span className="text-[9px] text-muted-foreground font-normal font-sans">
                            ({Math.round((item.value / filteredLeads.length) * 100)}%)
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Bar Chart & Company List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Bar Chart (1/2 width) */}
        <Card className="shadow-xs border border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Leads by Priority</CardTitle>
            <CardDescription>
              Volume count of active CRM opportunities organized by prioritization tiers.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pb-4">
            {filteredLeads.length === 0 ? (
              <div className="w-full h-full bg-muted/20 border border-dashed border-border/80 rounded-lg flex flex-col items-center justify-center text-center p-6">
                <FolderMinus className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-xs font-semibold">No Data for Priority Distribution</p>
              </div>
            ) : (
              <ChartContainer config={{}} className="w-full h-full min-h-[200px]">
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => Math.round(val).toString()}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(200, 200, 200, 0.08)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0]?.payload;
                        if (!data) return null;
                        return (
                          <div className="bg-background border border-border p-2.5 rounded-lg shadow-xl text-xs">
                            <span className="font-semibold">{data.name} Priority</span>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-xs"
                                style={{ backgroundColor: data.color }}
                              />
                              <span>{data.value} Leads</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Lead Account/Company Performance Table (1/2 width) */}
        <Card className="shadow-xs border border-border flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Top Ingestion Companies</CardTitle>
              <CardDescription>
                Conversion performance and lead concentration metrics across active accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {companyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border/80 rounded-lg">
                  <FolderMinus className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-xs font-semibold">No Client Companies Associated</p>
                  <p className="text-[10px] text-muted-foreground max-w-xs mt-1">
                    Assign company identifiers to your leads to populate company analytics.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-muted-foreground">
                    <thead className="text-[10px] uppercase text-muted-foreground tracking-wider border-b border-border/60">
                      <tr>
                        <th className="py-2.5 font-bold">Company</th>
                        <th className="py-2.5 font-bold text-center">Total Leads</th>
                        <th className="py-2.5 font-bold text-center">Won Leads</th>
                        <th className="py-2.5 font-bold text-right">Conversion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {companyData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3 font-semibold text-foreground flex items-center gap-1.5">
                            <span className="p-1 rounded bg-muted/60 text-muted-foreground">
                              <Briefcase className="w-3.5 h-3.5" />
                            </span>
                            {row.company}
                          </td>
                          <td className="py-3 text-center font-mono font-semibold text-foreground">
                            {row.total}
                          </td>
                          <td className="py-3 text-center font-mono text-emerald-500 font-bold">
                            {row.won}
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <span className="font-mono font-extrabold text-foreground">
                                {row.conversion}%
                              </span>
                              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="h-full bg-emerald-500 rounded-full"
                                  style={{ width: `${row.conversion}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
