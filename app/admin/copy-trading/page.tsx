'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Play, Square, Activity, Target, Shield, Clock } from 'lucide-react'

type CopyTrade = {
  id: string
  symbol: string
  order_type: string
  volume: number
  status: string
  opened_at: string
  closed_at: string | null
  follower_user_id: string
  profiles: {
    full_name: string
  }
}

export default function CopyTradingControlPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentTrades, setRecentTrades] = useState<CopyTrade[]>([])
  const [stats, setStats] = useState({
    totalCopied: 0,
    successRate: 0,
    activePositions: 0,
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
    checkServiceStatus()
    fetchRecentTrades()
    
    // Auto-refresh every 10s
    const interval = setInterval(() => {
      fetchRecentTrades()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/auth/login'); return }

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) { router.push('/dashboard') }
  }

  const checkServiceStatus = async () => {
    try {
      const response = await fetch('/api/start-copy-trading-v2')
      const data = await response.json()
      setIsRunning(data.running)
    } catch (error) {
      console.error('Error checking service status:', error)
    }
  }

  const fetchRecentTrades = async () => {
    const { data } = await supabase
      .from('copy_trades')
      .select(`*, profiles!copy_trades_follower_user_id_fkey(full_name)`)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setRecentTrades(data as any)

      const total = data.length
      const successful = data.filter((t) => t.status === 'opened' || t.status === 'closed').length
      const active = data.filter((t) => t.status === 'opened').length

      setStats({
        totalCopied: total,
        successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
        activePositions: active,
      })
    }
  }

  const startService = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/start-copy-trading-v2', { method: 'POST' })
      const data = await response.json()

      if (data.success) {
        setIsRunning(true)
      } else {
        alert('❌ Erreur: ' + data.error)
      }
    } catch (error) {
      alert('❌ Erreur lors du démarrage')
    } finally {
      setLoading(false)
    }
  }

  const stopService = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/start-copy-trading-v2', { method: 'DELETE' })
      const data = await response.json()

      if (data.success) {
        setIsRunning(false)
      }
    } catch (error) {
      alert('❌ Erreur lors de l\'arrêt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="section-header-block mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Copy Trading Control</h2>
        <p className="text-slate-400">Gérez le service de copie automatique globale des trades vers vos clients.</p>
      </div>

      {/* Main Control Switch */}
      <div className="glass-panel p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-blue-500">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              <Activity size={32} className={isRunning ? 'animate-pulse' : ''} />
            </div>
            {isRunning && <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1e293b]"></span>}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Moteur Broker</h2>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {isRunning ? '🔴 En Ligne (Actif)' : '⏸️ Suspendu'}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto">
          {isRunning ? (
            <button
              onClick={stopService}
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-500 border border-rose-500/30 transition-all shadow-[0_0_20px_rgba(225,29,72,0.2)] disabled:opacity-50"
            >
              {loading ? 'Arrêt...' : <><Square size={20} /> Arrêter le relais</>}
            </button>
          ) : (
            <button
              onClick={startService}
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {loading ? 'Démarrage...' : <><Play size={20} /> Lancer le copie automatique</>}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <Target size={24} className="text-indigo-400 mb-3" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Trades Copiés</p>
          <h3 className="text-4xl font-black text-white">{stats.totalCopied}</h3>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <Shield size={24} className="text-emerald-400 mb-3" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Taux de Succès</p>
          <h3 className="text-4xl font-black text-white">{stats.successRate}%</h3>
        </div>
        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
          <Clock size={24} className="text-blue-400 mb-3" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Récents Actifs</p>
          <h3 className="text-4xl font-black text-white">{stats.activePositions}</h3>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f172a]/50">
          <h3 className="text-xl font-bold text-white">Monitoring des Positions (Live)</h3>
          <button onClick={fetchRecentTrades} className="text-sm text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-4 py-2 rounded-lg transition-colors">
            Rafraîchir
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="bg-[#0f172a]/20">
              <tr>
                <th>Utilisateur (Client)</th>
                <th>Symbole</th>
                <th>Sens</th>
                <th>Volume</th>
                <th>Statut Broker</th>
                <th className="text-right">Horodatage</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.length > 0 ? (
                recentTrades.map((trade) => {
                  const isBuy = trade.order_type === 'BUY'
                  return (
                    <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                      <td className="font-semibold text-white">
                        {trade.profiles?.full_name || 'Inconnu'}
                      </td>
                      <td className="font-bold text-indigo-400">{trade.symbol}</td>
                      <td>
                        <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {trade.order_type}
                        </span>
                      </td>
                      <td className="font-mono text-slate-300">{trade.volume || '0.01'}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                          trade.status === 'opened' ? 'bg-blue-500/20 text-blue-400' :
                          trade.status === 'closed' ? 'bg-emerald-500/20 text-emerald-400' :
                          trade.status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="text-right text-xs text-slate-400">
                        {new Date(trade.opened_at).toLocaleTimeString('fr-FR')}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Aucun trade intercepté récemment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
