import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Zap, TrendingUp, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  // Fetch some stats for the dashboard
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false)
  const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { count: signalsCount } = await supabase.from('telegram_signals').select('*', { count: 'exact', head: true })

  return (
    <div className="animate-fade-in space-y-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
            <Users size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{usersCount || 0}</h3>
          <p className="text-sm font-medium text-slate-400">Total Clients</p>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{activeSubs || 0}</h3>
          <p className="text-sm font-medium text-slate-400">Abonnés Actifs</p>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
            <Zap size={24} />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{signalsCount || 0}</h3>
          <p className="text-sm font-medium text-slate-400">Signaux Reçus</p>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center border-emerald-500/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-bold text-emerald-400 mb-1">Système Actif</h3>
          <p className="text-sm font-medium text-slate-400">Tout fonctionne</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-400" /> Gestion Rapide
          </h3>
          <p className="text-slate-400 mb-6 text-sm">
            Accédez rapidement à la gestion des utilisateurs pour activer, suspendre ou modifier les comptes sans passer par Stripe.
          </p>
          <Link href="/admin/users" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors w-full inline-block text-center">
            Ouvrir la gestion des membres
          </Link>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={20} className="text-indigo-400" /> Configuration Signaux
          </h3>
          <p className="text-slate-400 mb-6 text-sm">
            Ajoutez de nouvelles sources Telegram, configurez le trading automatique et consultez l'état de la connexion.
          </p>
          <div className="flex gap-4">
            <Link href="/admin/telegram-channels" className="bg-[#1e293b] hover:bg-slate-700 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex-1 text-center">
              Canaux
            </Link>
            <Link href="/admin/logs" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex-1 text-center">
              Voir les Logs
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  )
}
