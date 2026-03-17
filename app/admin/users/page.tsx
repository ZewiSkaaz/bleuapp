import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import UsersTableClient from './UsersTableClient'

export default async function AdminUsersPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  const { data: users } = await supabase
    .from('profiles')
    .select(`
      *,
      subscriptions(*),
      mt5_accounts(count)
    `)
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des Clients BleuApp</h1>

        <div className="card">
          <div className="overflow-x-auto">
            <UsersTableClient initialUsers={users || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

