'use client'

import { useState, useEffect } from 'react'

import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,

} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CircleFadingPlus, CircleStop, Search, Tags, Plus, X, Trash2 } from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field'
import { api } from '@/lib/axios'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [localData, setLocalData] = useState<TData[]>(data)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('Lead')
  const [tags, setTags] = useState('')

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get("/api/leads")
        const fetchedData = response.data.data || response.data
        
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
          Status: lead.status || "Open",
          lastSeen: lead.lastContactDate || new Date().toISOString(),
          'next date': lead.nextFollowUpDate || new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
        }))
        setLocalData(mappedLeads)
      } catch (err) {
      }
    }
    fetchLeads()
  }, [])

  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) return

    const confirmMsg = `Are you sure you want to delete the ${selectedRows.length} selected lead(s)?`
    if (!confirm(confirmMsg)) return

    try {
      const idsToDelete = selectedRows.map(row => (row.original as any).id)
      await Promise.all(idsToDelete.map(id => api.delete(`/api/leads/${id}`)))
      setLocalData(prev => prev.filter((lead: any) => !idsToDelete.includes(lead.id)))
      table.resetRowSelection()
    } catch (err) {
      alert("Failed to delete some selected leads.")
    }
  }

  const openEditModal = (lead: any) => {
    setEditingLeadId(lead.id)
    setName(lead.name)
    setEmail(lead.email || '')
    setPhone(lead.phone === '-' ? '' : lead.phone || '')
    setCompany(lead.company === '-' ? '' : lead.company || '')
    setPriority(lead.priority ? lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1) : 'Medium')
    setStatus(lead.Status === 'Open' ? 'Lead' : lead.Status || 'Lead')
    setTags(lead.tags ? lead.tags.join(', ') : '')
    setIsAddModalOpen(true)
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    try {
      const response = await api.post("/api/leads", {
        customerName: name,
        email,
        phone: phone || null,
        company: company || null,
        priority: priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        status: (status === "Lead" ? "Open" : status) as "Open" | "Active" | "Closed" | "Lost",
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        notes: "",
        lastContactDate: new Date().toISOString(),
        nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })

      const createdLead = response.data.lead || response.data.data
      
      const mappedLead = {
        id: createdLead.id,
        name: createdLead.customerName,
        email: createdLead.email || "-",
        emaiL: createdLead.email || "-",
        phone: createdLead.phone || "-",
        company: createdLead.company || "-",
        priority: createdLead.priority ? createdLead.priority.toLowerCase() : "medium",
        tags: createdLead.tags || [],
        Status: createdLead.status || "Open",
        lastSeen: createdLead.lastContactDate || new Date().toISOString(),
        'next date': createdLead.nextFollowUpDate || new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
      } as unknown as TData

      setLocalData(prev => [mappedLead, ...prev])

      // reset form
      setName('')
      setEmail('')
      setPhone('')
      setCompany('')
      setPriority('Medium')
      setStatus('Lead')
      setTags('')
      setIsAddModalOpen(false)
    } catch (err) {
      alert("Failed to add lead to server.")
    }
  }

  const handleEditLead = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingLeadId || !name || !email) return

    try {
      const response = await api.put(`/api/leads/${editingLeadId}`, {
        customerName: name,
        email,
        phone: phone || null,
        company: company || null,
        priority: priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        status: (status === "Lead" ? "Open" : status) as "Open" | "Active" | "Closed" | "Lost",
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        notes: "",
        lastContactDate: new Date().toISOString()
      })

      const updatedLead = response.data.data

      const mappedLead = {
        id: updatedLead.id,
        name: updatedLead.customerName,
        email: updatedLead.email || "-",
        emaiL: updatedLead.email || "-",
        phone: updatedLead.phone || "-",
        company: updatedLead.company || "-",
        priority: updatedLead.priority ? updatedLead.priority.toLowerCase() : "medium",
        tags: updatedLead.tags || [],
        Status: updatedLead.status || "Open",
        lastSeen: updatedLead.lastContactDate || new Date().toISOString(),
        'next date': updatedLead.nextFollowUpDate || new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60'
      } as unknown as TData

      setLocalData(prev =>
        prev.map((lead: any) => (lead.id === editingLeadId ? mappedLead : lead))
      )

      // reset form
      setName('')
      setEmail('')
      setPhone('')
      setCompany('')
      setPriority('Medium')
      setStatus('Lead')
      setTags('')
      setEditingLeadId(null)
      setIsAddModalOpen(false)
    } catch (err) {
      alert("Failed to update lead.")
    }
  }

  const table = useReactTable({
    data: localData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility
    },
    meta: {
      editLead: (lead: any) => {
        openEditModal(lead)
      },
      deleteLead: async (id: string) => {
        try {
          await api.delete(`/api/leads/${id}`)
          setLocalData(prev => prev.filter((lead: any) => lead.id !== id))
        } catch (err) {
          alert("Failed to delete lead.")
        }
      },
      updateLeadStatus: async (id: string, newStatus: string) => {
        try {
          await api.put(`/api/leads/${id}`, { status: newStatus })
          setLocalData(prev =>
            prev.map((lead: any) =>
              lead.id === id ? { ...lead, Status: newStatus } : lead
            )
          )
        } catch (err) {
          alert("Failed to update lead status.")
        }
      }
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      {/* Filters */}

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center border rounded-md px-2 bg-background shadow-xs'>
            <Input
              placeholder='Search by name, email, phone, status, company...'
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={event =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className='max-w-xl w-96 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none'
            />
            <Search className="text-muted-foreground w-4 h-4 mr-1" />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5 active:scale-95 transition-all">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 active:scale-95 transition-all animate-in fade-in slide-in-from-left-2 duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
        </div>

        {/* Column visibility */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <div className="flex flex-col">
              <DropdownMenuLabel>Status </DropdownMenuLabel>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='w-30 '>
                  <CircleStop className='w-4 h-4 text-black' />
                  All Status
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <div className="flex flex-col">
              <DropdownMenuLabel>Priority </DropdownMenuLabel>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className=''>
                  <CircleFadingPlus />
                  All Priority
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <div className="flex flex-col">
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className=''>
                  <Tags />
                  All Tags
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={value => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>


        </div>
      </div>

      {/* Table */}
      <div className='rounded-xl border border-border mt-4 bg-card shadow-xs overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='font-medium text-left'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Add / Edit Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground border border-border shadow-2xl rounded-xl p-6 max-w-lg w-full mx-4 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setName('')
                setEmail('')
                setPhone('')
                setCompany('')
                setPriority('Medium')
                setStatus('Lead')
                setTags('')
                setEditingLeadId(null)
                setIsAddModalOpen(false)
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl font-semibold mb-1">{editingLeadId ? "Edit Lead" : "Add New Lead"}</h2>
            <p className="text-sm text-muted-foreground mb-5">
              {editingLeadId ? "Update the lead's details. Click save when you're done." : "Enter the lead's details. Click save when you're done."}
            </p>
            <form onSubmit={editingLeadId ? handleEditLead : handleAddLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </Field>
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </Field>
                <Field>
                  <FieldLabel>Company</FieldLabel>
                  <Input
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel>Priority</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-3 py-2 rounded-md text-xs font-medium border transition-all ${priority === p
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-background hover:bg-muted text-muted-foreground border-border'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {['Lead', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${status === s
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-background hover:bg-muted text-muted-foreground border-border'
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>

              <Field>
                <FieldLabel>Tags</FieldLabel>
                <Input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. Warm, New, SaaS (comma separated)"
                />
              </Field>

              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => {
                  setName('')
                  setEmail('')
                  setPhone('')
                  setCompany('')
                  setPriority('Medium')
                  setStatus('Lead')
                  setTags('')
                  setEditingLeadId(null)
                  setIsAddModalOpen(false)
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="active:scale-[0.98] transition-all">
                  Save Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}