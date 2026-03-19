import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TerminalClient from './TerminalClient'

export const revalidate = 0

export default async function AdminLogsPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  // Fetch recent system signals to simulate a live terminal feed
  const { data: signals } = await supabase
    .from('telegram_signals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // Fetch recent profiles to show member activity
  const { data: newUsers } = await supabase
    .from('profiles')
    .select('id, full_name, email, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="animate-fade-in h-[calc(100vh-120px)] flex flex-col">
      <div className="section-header-block mb-4 shrink-0">
        <h2 className="text-3xl font-bold text-white mb-2">Logs & Terminal</h2>
        <p className="text-slate-400">Supervisez l'activité en temps réel du bot et relancez les systèmes en cas de bug.</p>
      </div>

      <div className="flex-1 min-h-0 bg-[#0f172a] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
        <TerminalClient initialSignals={signals || []} recentUsers={newUsers || []} />
      </div>
    </div>
  )
}
