'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Link as LinkIcon, Trash2, Plus, Shield, LockOpen, Loader2 } from 'lucide-react'

export default function TelegramChannelsClient({ initialChannels }: { initialChannels: any[] }) {
  const [channels, setChannels] = useState(initialChannels)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    chat_id: '',
    style: 'signals_vision',
    prefix: '',
    is_premium: true
  })
  const router = useRouter()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/admin/telegram-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...formData })
      })

      if (res.ok) {
        const { data } = await res.json()
        setChannels([data, ...channels])
        setFormData({ name: '', chat_id: '', style: 'signals_vision', prefix: '', is_premium: true })
        router.refresh()
      } else {
        const error = await res.json()
        alert('Erreur: ' + (error.error || 'Impossible d\'ajouter le canal'))
      }
    } catch (err) {
      alert('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer le canal "${name}" ? Le bot ne lira plus ses signaux.`)) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/admin/telegram-channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      })

      if (res.ok) {
        setChannels(channels.filter(c => c.id !== id))
        router.refresh()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (err) {
      alert('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Ajout Canal */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <Zap size={20} className="text-indigo-400" /> Ajouter un nouveau canal
        </h3>
        
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Nom du Canal</label>
              <input
                type="text"
                required
                placeholder="Ex: VIP Gold"
                className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Chat ID</label>
              <input
                type="text"
                required
                placeholder="-100..."
                className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.chat_id}
                onChange={e => setFormData({...formData, chat_id: e.target.value})}
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Type d'accès</label>
              <select
                className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.is_premium ? 'true' : 'false'}
                onChange={e => setFormData({...formData, is_premium: e.target.value === 'true'})}
              >
                <option value="true">💎 Premium (Payant)</option>
                <option value="false">🔓 Gratuit (Public)</option>
              </select>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Style Bot</label>
              <select
                className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.style}
                onChange={e => setFormData({...formData, style: e.target.value})}
              >
                <option value="signals_vision">Signals Vision</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-slate-400 mb-1">Préfixe</label>
              <input
                type="text"
                placeholder="Ex: 🟣"
                className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.prefix}
                onChange={e => setFormData({...formData, prefix: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              {loading ? 'Ajout...' : 'Connecter le Canal'}
            </button>
          </div>
        </form>
      </div>

      {/* Liste des canaux */}
      <div className="space-y-3">
        {channels.length > 0 ? (
          channels.map(channel => (
            <div key={channel.id} className="source-card active-source group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    {channel.name || 'Canal Telegram'} 
                    <span className="live-tag">CONNECTED</span>
                  </h4>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <code className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-mono">
                      {channel.chat_id}
                    </code>
                    {channel.is_premium ? (
                      <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        <Shield size={12} /> Premium
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                        <LockOpen size={12} /> Gratuit
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-4 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(channel.id, channel.name || channel.chat_id)}
                  disabled={loading}
                  className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg transition-colors"
                  title="Supprimer le canal"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucun Canal</h3>
            <p className="text-slate-400">Ajoutez votre premier canal Telegram ci-dessus pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}
