import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UsersTableClient from './UsersTableClient'

export default async function AdminUsersPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Comptes Clients</h2>
        <p className="text-slate-400">Ajoutez, modifiez ou supprimez des membres de votre SaaS directement ici.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <UsersTableClient initialUsers={users || []} />
        </div>
      </div>
    </div>
  )
}
