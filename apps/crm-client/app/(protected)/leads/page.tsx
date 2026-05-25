import { columns, User } from './columns'
import { DataTable } from './data-table'
async function getUsers(): Promise<User[]> {
  const res = await fetch(
    'https://64a6f5fc096b3f0fcc80e3fa.mockapi.io/api/users'
  )
  const data = await res.json()
  return data
}

export default async function Page() {
  const data = await getUsers()

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
      <DataTable columns={columns} data={data} />
    </div>
  )
}