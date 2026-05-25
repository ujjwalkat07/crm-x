"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { columns, User } from './columns'
import { DataTable } from './data-table'
import { Loader2 } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await api.get("/api/leads");
        const fetchedData = res.data.data || res.data;
        
        // Map backend Lead to frontend User structure
        const mappedLeads = fetchedData.map((lead: any) => ({
          id: lead.id,
          name: lead.customerName,
          email: lead.email || "-",
          emaiL: lead.email || "-",
          phone: lead.phone || "-",
          company: lead.company || "-",
          priority: lead.priority ? lead.priority.toLowerCase() : "medium",
          tags: lead.tags || [],
          status: lead.status || "Open",
          lastSeen: lead.lastContactDate || new Date().toISOString(),
          'next date': lead.nextFollowUpDate || new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
        }));
        
        setData(mappedLeads);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  return (
    <div className='p-6 md:p-8 space-y-6'>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>All Leads</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Manage, organize, and assign prospective sales leads in your CRM.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 text-center">
          {error}
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}