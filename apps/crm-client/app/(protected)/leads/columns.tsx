'use client'

import { ColumnDef } from '@tanstack/react-table'

import { MoreHorizontal, ArrowUpDown, Phone, Edit, Trash2, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox';

export type User = {
  id: string
  name: string
  emaiL: string
  image: string
  lastSeen: string
}

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="text-xs font-medium">Customer Name</span>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-xs font-medium">
          {row.getValue('name')}
        </div>
      )
    }
  },
  {
    accessorKey: 'email',
    header: () => {
      return (
        <span className="text-xs font-medium">Email</span>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-xs font-medium">
          {row.getValue('email')}
        </div>
      )
    }
  },
  {
    accessorKey: 'phone',
    header: () => {
      return (
        <span className="text-xs font-medium">Phone</span>
      )
    },
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      if (!phone || phone === '-') {
        return <span className="text-muted-foreground">-</span>
      }
      return (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium group transition-colors text-xs"
        >
          <span className="truncate">{phone}</span>
        </a>
      )
    }
  },
  {
    accessorKey: 'company',
    header: () => {
      return (
        <span className="text-xs font-medium">Company</span>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-xs font-medium">
          {row.getValue('company')}
        </div>
      )
    }
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="text-xs font-medium">Priority</span>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    filterFn: 'equals',
    cell: ({ row }) => {
      const priority = (row.getValue('priority') as string || 'medium').toLowerCase()
      const config = {
        high: { color: 'text-rose-600 bg-rose-50/50 dark:bg-rose-500/10 border-rose-200/60 dark:border-rose-500/20', dot: 'bg-rose-500' },
        medium: { color: 'text-amber-600 bg-amber-50/50 dark:bg-amber-500/10 border-amber-200/60 dark:border-amber-500/20', dot: 'bg-amber-500' },
        low: { color: 'text-blue-600 bg-blue-50/50 dark:bg-blue-500/10 border-blue-200/60 dark:border-blue-500/20', dot: 'bg-blue-500' },
      }[priority] || { color: 'text-muted-foreground bg-muted border-border', dot: 'bg-muted-foreground' }

      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${config.color}`}>
          <span className={`w-1 h-1 rounded-full ${config.dot}`} />
          {priority}
        </span>
      )
    }
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => {
      return (
        <span className="text-xs font-medium">Tags</span>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const rowTags = row.getValue(columnId);
      if (Array.isArray(rowTags)) {
        return rowTags.some(tag => String(tag).toLowerCase() === String(filterValue).toLowerCase());
      }
      return false;
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="text-xs font-medium">Status</span>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    filterFn: 'equals',
    cell: ({ row, table }) => {
      const user = row.original
      const currentStatus = (row.getValue('status') as string || "Open").toLowerCase()

      const statusConfig = {
        open: { color: 'text-blue-600 bg-blue-50/80 border-blue-200/60 hover:bg-blue-100/50', dot: 'bg-blue-500' },
        active: { color: 'text-emerald-600 bg-emerald-50/80 border-emerald-200/60 hover:bg-emerald-100/50', dot: 'bg-emerald-500' },
        closed: { color: 'text-slate-600 bg-slate-50/80 border-slate-200/60 hover:bg-slate-100/50', dot: 'bg-slate-400' },
        lost: { color: 'text-rose-600 bg-rose-50/80 border-rose-200/60 hover:bg-rose-100/50', dot: 'bg-rose-500' },
      }[currentStatus] || { color: 'text-muted-foreground bg-muted border-border hover:bg-muted/80', dot: 'bg-muted-foreground' }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`h-7 min-w-[90px] px-2 py-0.5 flex items-center justify-between text-[11px] font-bold capitalize border rounded-full transition-colors cursor-pointer ${statusConfig.color}`}>
              <span className="flex items-center gap-1.5">
                <span className={`w-1 h-1 rounded-full ${statusConfig.dot}`} />
                {row.getValue('status') || "Open"}
              </span>
              <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 bg-card border border-border shadow-md rounded-md p-1">
            {['Open', 'Active', 'Closed', 'Lost'].map(status => {
              const sLower = status.toLowerCase()
              const itemDot = {
                open: 'bg-blue-500',
                active: 'bg-emerald-500',
                closed: 'bg-slate-400',
                lost: 'bg-rose-500',
              }[sLower] || 'bg-muted-foreground'

              return (
                <DropdownMenuItem
                  key={status}
                  className="capitalize flex items-center gap-2 cursor-pointer font-bold text-xs px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  onClick={() => {
                    (table.options.meta as any)?.updateLeadStatus(user.id, status)
                  }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${itemDot}`} />
                  {status}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
  {
    accessorKey: 'lastSeen',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="text-xs font-medium">Last Contact</span>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue('lastSeen')
      const date = val ? new Date(val as string) : new Date()
      const formatted = date.toLocaleDateString()
      return <div className='font-medium text-xs'>{formatted}</div>
    }
  },
  {
    accessorKey: 'next date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <span className="text-xs font-medium">Next Date</span>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const val = row.getValue('next date')
      const date = val ? new Date(val as string) : new Date()
      const formatted = date.toLocaleDateString()
      return <div className='font-medium text-xs'>{formatted}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const user = row.original
      const phone = (user as any).phone as string

      return (
        <div className="flex items-center justify-end gap-1">
          {phone && phone !== '-' ? (
            <Button
              variant="ghost"
              size="icon-xs"
              asChild
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-1.5 rounded-md cursor-pointer transition-colors shrink-0"
              title={`Call ${phone}`}
            >
              <a href={`tel:${phone}`}>
                <Phone className="w-3.5 h-3.5" />
              </a>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-xs"
              disabled
              className="text-muted-foreground/20 p-1.5 rounded-md cursor-not-allowed shrink-0"
              title="No phone number"
            >
              <Phone className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-1.5 rounded-md cursor-pointer transition-colors shrink-0"
            onClick={() => {
              (table.options.meta as any)?.editLead(user)
            }}
            title="Edit Lead"
          >
            <Edit className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-md cursor-pointer transition-colors shrink-0"
            onClick={() => {
              if (confirm("Are you sure you want to delete this lead?")) {
                (table.options.meta as any)?.deleteLead(user.id)
              }
            }}
            title="Delete Lead"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-7 w-7 p-0 hover:bg-muted cursor-pointer rounded-md shrink-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-3.5 h-3.5 text-muted-foreground' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className="w-40 bg-card border border-border shadow-md rounded-md p-1">
              <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground/80 uppercase px-2 py-1.5">More Options</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-b border-border/50" />
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 text-xs font-semibold px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                Copy ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]