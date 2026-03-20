'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Database, Plus, CheckCircle, XCircle, Trash2, Shield, Loader2, Square, Play } from 'lucide-react'

type Broker = {
  id: string
  name: string
  servers?: string[]
}

type AdminMT5Account = {
  id: string
  account_number: number
  is_active: boolean
  is_admin_account: boolean
  broker_name: string
  server_name: string
  metaapi_account_id: string | null
}

export default function AdminMT5AccountsPage() {
  const [adminAccounts, setAdminAccounts] = useState<AdminMT5Account[]>([])
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [servers, setServers] = useState<string[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingServers, setLoadingServers] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    broker_name: '',
    server_name: '',
    account_number: '',
    password: '',
  })

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
    fetchAdminAccounts()
    fetchBrokers()
  }, [])

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/auth/login'); return }
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) { router.push('/dashboard') }
  }

  const fetchAdminAccounts = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: accountsData } = await supabase
      .from('mt5_accounts')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_admin_account', true)

    if (accountsData) setAdminAccounts(accountsData as AdminMT5Account[])
  }

  const fetchBrokers = async () => {
    try {
      const response = await fetch('/api/metaapi/brokers')
      const data = await response.json()
      if (data.success && data.brokers) setBrokers(data.brokers)
    } catch (err) {
      console.error('Error fetching brokers:', err)
    }
  }

  const fetchServers = async (brokerName: string) => {
    setLoadingServers(true)
    try {
      const response = await fetch(`/api/metaapi/servers?broker=${encodeURIComponent(brokerName)}`)
      const data = await response.json()
      if (data.success && data.servers) {
        setServers(data.servers.map((s: any) => s.name))
      } else {
        const broker = brokers.find((b) => b.name === brokerName)
        setServers(broker?.servers || [])
      }
    } catch (err) {
      const broker = brokers.find((b) => b.name === brokerName)
      setServers(broker?.servers || [])
    } finally {
      setLoadingServers(false)
    }
  }

  const handleBrokerChange = (brokerName: string) => {
    setFormData({ ...formData, broker_name: brokerName, server_name: '' })
    fetchServers(brokerName)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/auth/login'); return }

      const response = await fetch('/api/metaapi/connect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Admin - ${formData.broker_name} - ${formData.account_number}`,
          login: formData.account_number,
          password: formData.password,
          server: formData.server_name,
          platform: 'mt5',
          magic: 0,
        }),
      })

      const metaApiData = await response.json()
      if (!metaApiData.success) throw new Error(metaApiData.error || 'Erreur lors de la connexion MetaApi')

      const { error: dbError } = await supabase.from('mt5_accounts').insert({
        user_id: session.user.id,
        broker_name: formData.broker_name,
        server_name: formData.server_name,
        account_number: parseInt(formData.account_number),
        password_encrypted: btoa(formData.password),
        is_active: true,
        is_admin_account: true,
        metaapi_account_id: metaApiData.accountId,
      })

      if (dbError) throw dbError

      setSuccess('Compte MT5 synchronisé avec succès!')
      setFormData({ broker_name: '', server_name: '', account_number: '', password: '' })
      setShowAddForm(false)
      fetchAdminAccounts()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du compte')
    } finally {
      setLoading(false)
    }
  }

  const toggleAccountStatus = async (accountId: string, currentStatus: boolean) => {
    const { error } = await supabase.from('mt5_accounts').update({ is_active: !currentStatus }).eq('id', accountId)
    if (!error) fetchAdminAccounts()
  }

  const deleteAccount = async (accountId: string) => {
    if (!confirm('Action irréversible. Êtes-vous sûr de vouloir supprimer ce compte MT5 ?')) return
    const { error } = await supabase.from('mt5_accounts').delete().eq('id', accountId)
    if (!error) fetchAdminAccounts()
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="section-header-block mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Comptes MT5 Clients</h2>
        <p className="text-slate-400">Supervisez les comptes de trading de vos clients connectés via MetaAPI.</p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-6 py-4 rounded-xl flex gap-3 text-sm font-semibold">
          <XCircle size={20} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-6 py-4 rounded-xl flex gap-3 text-sm font-semibold">
          <CheckCircle size={20} /> {success}
        </div>
      )}

      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database size={24} className="text-blue-400" /> Comptes MT5 Connectés
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-colors ${showAddForm ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg'}`}
          >
            {showAddForm ? '⨯ Annuler' : <><Plus size={18} /> Lier un compte</>}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-[#0f172a]/50 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Ajout via MetaApi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Broker</label>
                <select
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.broker_name}
                  onChange={(e) => handleBrokerChange(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un broker...</option>
                  {brokers.map((broker) => (
                    <option key={broker.id} value={broker.name}>{broker.name}</option>
                  ))}
                </select>
              </div>

              {formData.broker_name && (
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Serveur {loadingServers && <Loader2 size={12} className="inline animate-spin ml-1" />}
                  </label>
                  <select
                    className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.server_name}
                    onChange={(e) => setFormData({ ...formData, server_name: e.target.value })}
                    required
                    disabled={loadingServers}
                  >
                    <option value="">Sélectionnez un serveur...</option>
                    {servers.map((server) => (
                      <option key={server} value={server}>{server}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Identifiant (Numéro MT5)</label>
                <input
                  type="number"
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  placeholder="Ex: 56983210"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Mot de passe Investor/Trader</label>
                <input
                  type="password"
                  className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500/90 p-4 rounded-xl mt-4 text-sm font-semibold flex items-center gap-3">
              <Shield size={24} className="shrink-0" />
              <span>Attention: Dès que ce compte maître ouvre un trade, la plateforme va le répliquer sur le réseau client. Assurez-vous des credentials.</span>
            </div>

            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-2 btn bg-blue-600 hover:bg-blue-500 text-white w-full rounded-xl py-3 shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />}
              {loading ? 'Synchronisation MetaApi...' : 'Connecter au réseau BleuApp'}
            </button>
          </form>
        )}

        {adminAccounts.length > 0 ? (
          <div className="space-y-4">
            {adminAccounts.map((account) => (
              <div key={account.id} className={`source-card border-l-4 ${account.is_active ? 'border-l-emerald-500 active-source' : 'border-l-slate-600 bg-[#0f172a]/50'}`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">{account.broker_name}</h3>
                    <span className="badge-member bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 flex items-center gap-1">
                      <Shield size={12} /> CLIENT
                    </span>
                    <span className={`badge-member px-3 ${account.is_active ? 'active' : 'bg-slate-700 text-slate-400 border-none'}`}>
                      {account.is_active ? 'ACTIF' : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
                    <span>Serveur: <span className="text-slate-200">{account.server_name}</span></span>
                    <span>Compte: <code className="bg-white/5 px-2 py-0.5 rounded text-blue-400">#{account.account_number}</code></span>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button
                    onClick={() => toggleAccountStatus(account.id, account.is_active)}
                    className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-colors flex-1 md:flex-none ${account.is_active ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'}`}
                  >
                    {account.is_active ? <><Square size={16} /> Pause</> : <><Play size={16} /> Reprendre</>}
                  </button>
                  <button
                    onClick={() => deleteAccount(account.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors flex items-center justify-center"
                    title="Supprimer ce compte"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 border border-dashed border-white/20 rounded-2xl bg-[#0f172a]/30">
            <Database size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun Compte Maître Détecté</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">C'est le moment de lier votre compte de trading qui va servir de signal pour l'ensemble des clients BleuApp.</p>
            <button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg inline-flex items-center gap-2">
              <Plus size={18} /> Lier mon compte
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
