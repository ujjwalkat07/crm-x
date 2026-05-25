"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle,
  TrendingUp,
  Search,
  MoveRight,
  SlidersHorizontal,
  Mail,
  Building2,
  ChevronRight,
  Briefcase,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../provider/AuthProvider";

export default function LandingPage() {
  const { user } = useAuth();
  const [activePipelineLead, setActivePipelineLead] = useState<string>("Stark Industries");

  // Interactive mock leads database for the live pipeline preview
  const [mockLeads, setMockLeads] = useState([
    { id: "1", name: "Stark Industries", contact: "Tony Stark", value: "$450,000", status: "Active", priority: "high" },
    { id: "2", name: "Wayne Enterprises", contact: "Bruce Wayne", value: "$950,000", status: "Open", priority: "high" },
    { id: "3", name: "Starlabs Corp", contact: "Barry Allen", value: "$120,000", status: "Closed", priority: "medium" },
    { id: "4", name: "Oscorp Holdings", contact: "Norman Osborn", value: "$300,000", status: "Lost", priority: "low" },
    { id: "5", name: "Pym Technologies", contact: "Hank Pym", value: "$180,000", status: "Active", priority: "medium" },
  ]);

  const updateLeadStatus = (leadName: string, newStatus: string) => {
    setMockLeads(prev =>
      prev.map(l => l.name === leadName ? { ...l, status: newStatus } : l)
    );
  };

  const currentLeadData = mockLeads.find(l => l.name === activePipelineLead) || mockLeads[0] || { name: "", contact: "", value: "", status: "", priority: "" };

  // Motion variants for smooth reveals
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const glowVariants: any = {
    animate: {
      scale: [1, 1.05, 0.98, 1],
      opacity: [0.15, 0.25, 0.2, 0.15],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden font-sans select-none selection:bg-white selection:text-black">

      {/* Premium Editorial Monochrome Glow Blobs */}
      <motion.div
        variants={glowVariants}
        animate="animate"
        className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] bg-neutral-800/20 rounded-full blur-[110px] pointer-events-none z-0"
      />
      <motion.div
        variants={glowVariants}
        animate="animate"
        className="absolute top-[25%] right-[-5%] w-[550px] h-[550px] bg-neutral-700/15 rounded-full blur-[130px] pointer-events-none z-0"
      />
      <motion.div
        variants={glowVariants}
        animate="animate"
        className="absolute bottom-[-5%] left-[15%] w-[450px] h-[450px] bg-neutral-800/15 rounded-full blur-[110px] pointer-events-none z-0"
      />

      {/* Global Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-black/85 backdrop-blur-md">
        <div className="container mx-auto px-6 md:px-12 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-all">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              CRM-X
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#benefits" className="hover:text-white transition-colors">Why CRM-X</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild variant="outline" className="border-zinc-800 hover:bg-zinc-900 text-xs font-semibold tracking-wide uppercase text-zinc-300">
                <Link href="/leads" className="flex items-center gap-1">
                  Dashboard
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
                  Log In
                </Link>
                <Button asChild className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider active:scale-95 transition-all">
                  <Link href="/signup" className="flex items-center gap-1">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-32 md:pb-36 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Hero Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>Grayscale Edition</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
            >
              Supercharge Your{" "}
              <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Sales Pipeline
              </span>{" "}
              with CRM-X
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base text-zinc-400 leading-relaxed mb-8 max-w-lg"
            >
              Manage prospects, track deals, and unlock conversion speed with beautiful, real-time interactive dashboards and robust pipeline automation.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
            >
              {user ? (
                <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider px-8 shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95 transition-all">
                  <Link href="/leads" className="flex items-center gap-2">
                    Enter Dashboard
                    <MoveRight className="w-4.5 h-4.5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider px-8 shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95 transition-all">
                    <Link href="/signup" className="flex items-center gap-2">
                      Get Started Free
                      <MoveRight className="w-4.5 h-4.5" />
                    </Link>
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center gap-6 text-[11px] text-zinc-500 font-medium uppercase tracking-wider border-t border-zinc-900 pt-8 w-full"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Instant Auth Activation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Unlimited Lead Captures</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Graphic / Monochrome Glassmorphic UI Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 md:p-6 backdrop-blur-md shadow-2xl shadow-black/80 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/2 via-transparent to-white/2 pointer-events-none" />

              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
                <div className="px-4 py-1 rounded bg-black/60 border border-zinc-900 text-[9px] text-zinc-500 font-mono tracking-wider">
                  app.crm-x.com/leads
                </div>
                <div className="w-8" />
              </div>

              {/* Fake UI Body */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-7 w-24 bg-white/10 border border-white/10 rounded animate-pulse" />
                </div>

                {/* Mock Lead Cards List */}
                {[
                  { name: "Stark Industries", value: "$450,000", priority: "high", status: "Active", color: "border-zinc-800" },
                  { name: "Wayne Enterprises", value: "$950,000", priority: "high", status: "Open", color: "border-zinc-800" },
                  { name: "Pym Tech", value: "$180,000", priority: "medium", status: "Active", color: "border-zinc-800" }
                ].map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.12 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${item.color} bg-black/30 hover:bg-zinc-950 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-zinc-900 flex items-center justify-center font-bold text-xs text-white">
                        {item.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">{item.name}</div>
                        <div className="text-[10px] text-zinc-500">Value: {item.value}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${item.priority === 'high' ? 'bg-white text-black font-extrabold' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                        {item.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-medium">
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Subtle glow border */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="py-24 bg-zinc-950 border-t border-zinc-900 relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-zinc-850 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Zap className="w-3 h-3 text-white" />
              <span>Built for Speed & Utility</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Unleash the Power of Integrated Lead Management
            </h2>
            <p className="text-zinc-400">
              Stop fighting outdated sheets. CRM-X organizes your prospects, tracking details, and sales velocity in a unified, beautiful client portal.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Feature 1 */}
            <motion.div
              variants={fadeInUp}
              className="bg-black border border-zinc-900 hover:border-zinc-750 rounded-xl p-6 text-left hover:bg-zinc-950 transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-zinc-100">Lead Pipeline</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Add, manage, and delete leads from a high-fidelity dashboard. Track company ownership, phone data, and follow-ups.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={fadeInUp}
              className="bg-black border border-zinc-900 hover:border-zinc-750 rounded-xl p-6 text-left hover:bg-zinc-950 transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-zinc-100">Advanced Filters</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sort and narrow leads instantly using status dropdowns, priority indices, and custom tag arrays.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={fadeInUp}
              className="bg-black border border-zinc-900 hover:border-zinc-750 rounded-xl p-6 text-left hover:bg-zinc-950 transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-zinc-100">Global Search</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Fuzzy search client names, corporate emails, phone numbers, and organizations instantly inside your table.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={fadeInUp}
              className="bg-black border border-zinc-900 hover:border-zinc-750 rounded-xl p-6 text-left hover:bg-zinc-950 transition-all active:scale-[0.98] group"
            >
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 mb-6 group-hover:bg-white group-hover:text-black transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-zinc-100">Secure Session</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your data is safe with robust JWT cookie storage, automatic token refreshing, and server route authorization middleware.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Live Interactive Pipeline Preview Section */}
      <section id="pipeline" className="py-24 container mx-auto px-6 md:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Copy Side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-5 text-left flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-300 text-[10px] font-bold uppercase tracking-widest mb-4">
              <TrendingUp className="w-3 h-3 text-white" />
              <span>Interactive Pipeline</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
              Animate Leads Across Custom Sales Stages
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Experience the smoothness of CRM-X. Click on any lead card to focus, and use the controls below to advance their stage dynamically inside our live interactive pipeline!
            </p>

            {/* Stage Controls */}
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 w-full space-y-4">
              <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-white" />
                <span>Move "{activePipelineLead}" To:</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["Open", "Active", "Closed", "Lost"].map(stage => (
                  <button
                    key={stage}
                    onClick={() => updateLeadStatus(activePipelineLead, stage)}
                    disabled={currentLeadData.status === stage}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase border tracking-wider transition-all active:scale-95 ${currentLeadData.status === stage
                        ? "bg-white border-white text-black cursor-default"
                        : "bg-black border-zinc-850 text-zinc-450 hover:border-zinc-700 hover:text-white"
                      }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pipeline Display Side */}
          <div className="lg:col-span-7 bg-zinc-950/30 border border-zinc-900 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">

            <div className="grid grid-cols-4 gap-3 text-center min-h-[300px]">

              {/* Pipeline Columns */}
              {["Open", "Active", "Closed", "Lost"].map(colStage => {
                const columnLeads = mockLeads.filter(l => l.status === colStage);

                return (
                  <div key={colStage} className="flex flex-col bg-black/40 rounded-xl border border-zinc-900/60 p-2 space-y-3">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-1.5">
                      {colStage} ({columnLeads.length})
                    </div>

                    <div className="flex-1 space-y-2">
                      <AnimatePresence mode="popLayout">
                        {columnLeads.map(lead => (
                          <motion.div
                            layout
                            key={lead.name}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 28 }}
                            onClick={() => setActivePipelineLead(lead.name)}
                            className={`p-3 rounded border text-left cursor-pointer transition-colors relative overflow-hidden ${activePipelineLead === lead.name
                                ? "bg-zinc-900 border-white"
                                : "bg-black hover:bg-zinc-950 border-zinc-900 hover:border-zinc-800"
                              }`}
                          >
                            {activePipelineLead === lead.name && (
                              <motion.div
                                layoutId="active-indicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                              />
                            )}
                            <div className="text-[10px] font-bold text-zinc-200 truncate">{lead.name}</div>
                            <div className="text-[9px] text-zinc-500 truncate mt-0.5">{lead.contact}</div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] font-mono font-semibold text-zinc-400">{lead.value}</span>
                              <span className={`w-1.5 h-1.5 rounded-full ${lead.priority === 'high' ? 'bg-white' : 'bg-zinc-650'
                                }`} />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* Trust & Benefits Section */}
      <section id="benefits" className="py-24 bg-zinc-950 border-t border-zinc-900 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Visual Graphic */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="order-2 lg:order-1 grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-black border border-zinc-900 p-6 rounded-xl text-center backdrop-blur-md">
                  <div className="text-3xl font-extrabold text-white mb-1">99.8%</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">System Uptime</div>
                </div>
                <div className="bg-black border border-zinc-900 p-6 rounded-xl text-center backdrop-blur-md">
                  <div className="text-3xl font-extrabold text-white mb-1">2.4x</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Deal Conversion</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-black border border-zinc-900 p-6 rounded-xl text-center backdrop-blur-md">
                  <div className="text-3xl font-extrabold text-white mb-1">24/7</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Cookie Safety</div>
                </div>
                <div className="bg-black border border-zinc-900 p-6 rounded-xl text-center backdrop-blur-md">
                  <div className="text-3xl font-extrabold text-white mb-1">100%</div>
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Data Control</div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="order-1 lg:order-2 text-left flex flex-col items-start"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-zinc-805 bg-zinc-900 text-zinc-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Building2 className="w-3 h-3 text-white" />
                <span>Enterprise Grade Security</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                Designed to Scales with Your Ambition
              </h2>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Whether you're a single founder tracking local leads or a scaling startup managing millions in deals, CRM-X provides the speed, database reliability, and visual clarity required to win.
              </p>

              <ul className="space-y-3.5 mb-8">
                {[
                  "Framer Motion transitions make client browsing highly reactive",
                  "Automated cookie interceptors refresh authorization states silently",
                  "Zero bloated client tracking libraries for maximum responsiveness",
                  "Full control to export and update prospect statuses instantly"
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-2.5 text-sm text-zinc-300"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-white shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 z-10 relative">
        <div className="container mx-auto px-6 md:px-12 text-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              What Sales Teams Say About CRM-X
            </h2>
            <p className="text-zinc-400">
              Discover how founders and sales directors are increasing pipeline velocity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Converting from complex spreadsheets to CRM-X saved us hours. The UI transitions are unbelievably smooth and keeping track of priority items has never been easier.",
                author: "Sarah Jenkins",
                role: "Director of Sales, TechRise",
                avatar: "SJ"
              },
              {
                quote: "The automated token refresh and secure cookie architecture gave our compliance team peace of mind. Plus, the UI is gorgeous—our team actually loves logging in.",
                author: "Marcus Vance",
                role: "Co-Founder, SaaSFlow",
                avatar: "MV"
              },
              {
                quote: "I can't imagine running my pipeline without CRM-X. The global search is extremely fast, and the tag management lets me organize warm leads in seconds.",
                author: "Elena Rostova",
                role: "BD Lead, AlphaCapital",
                avatar: "ER"
              }
            ].map((t, idx) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.6 }}
                className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-xl text-left flex flex-col justify-between backdrop-blur-md"
              >
                <p className="text-xs text-zinc-400 italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{t.author}</h4>
                    <p className="text-[10px] text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Large Call-To-Action (CTA) Footer Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-black relative z-10">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto rounded-2xl border border-zinc-900 bg-zinc-950/50 p-12 md:p-16 backdrop-blur-md relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-zinc-800 via-white to-zinc-800" />

            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Ready to Win More Deals?
            </h2>
            <p className="text-zinc-300 text-xs mb-8 max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
              Get setup in less than two minutes. Bring order to your pipelines and start closing leads faster today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider px-8 shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95 transition-all">
                  <Link href="/leads" className="flex items-center gap-2">
                    Enter Dashboard
                    <MoveRight className="w-4.5 h-4.5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider px-8 shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95 transition-all">
                    <Link href="/signup" className="flex items-center gap-2">
                      Get Started Free
                      <MoveRight className="w-4.5 h-4.5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider px-8 shadow-[0_0_20px_rgba(255,255,255,0.08)] active:scale-95 transition-all">
                    <Link href="/login">
                      Login to Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-12 relative z-10 text-[10px] text-zinc-650 tracking-wider uppercase">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-bold text-xs tracking-tight text-white">CRM-X</span>
            <span className="ml-2 font-semibold text-zinc-500">© 2026 CRM-X Inc. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-500 font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">API License</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}