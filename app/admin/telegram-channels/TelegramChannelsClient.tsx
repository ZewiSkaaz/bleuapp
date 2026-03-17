'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TelegramChannelsClient({ initialChannels }: { initialChannels: any[] }) {
  const [channels, setChannels] = useState(initialChannels)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    chat_id: '',
    style: 'signals_vision',
    prefix: ''
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
        setFormData({ chat_id: '', style: 'signals_vision', prefix: '' })
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

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce canal ? Le bot ne lira plus ses signaux.')) return
    
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
      <div className="card bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-primary-800">Ajouter un nouveau canal</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chat ID</label>
              <input
                type="text"
                required
                placeholder="-1002534575051"
                className="input"
                value={formData.chat_id}
                onChange={e => setFormData({...formData, chat_id: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Style de parsing</label>
              <select
                className="input"
                value={formData.style}
                onChange={e => setFormData({...formData, style: e.target.value})}
              >
                <option value="signals_vision">Signals Vision (Défaut)</option>
                <option value="vip">Client VIP</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Préfixe de reconnaissance</label>
              <input
                type="text"
                placeholder="ex: 🟣 Test Vision"
                className="input"
                value={formData.prefix}
                onChange={e => setFormData({...formData, prefix: e.target.value})}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full md:w-auto"
          >
            {loading ? 'Ajout en cours...' : '+ Ajouter le canal'}
          </button>
        </form>
      </div>

      <div className="card bg-white p-0 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Chat ID</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Style</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Préfixe</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {channels.length > 0 ? (
              channels.map(channel => (
                <tr key={channel.id} className="hover:bg-blue-50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm">{channel.chat_id}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-800">
                      {channel.style}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{channel.prefix || '-'}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(channel.id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Aucun canal configuré. Ajoutez-en un ci-dessus.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
