'use client'

import { useState } from 'react'
import { MoreVertical, Edit, Trash2, Shield, Search, Plus, UserPlus, CheckCircle, XCircle } from 'lucide-react'
import ModalPortal from '@/components/ModalPortal'

export default function UsersTableClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({ email: '', full_name: '', password: '' })
  
  const toggleSubscription = async (userId: string, currentStatus: string) => {
    if (!window.confirm(`Voulez-vous vraiment ${currentStatus === 'active' ? 'suspendre' : 'activer'} cet utilisateur ?`)) return
    
    setLoadingId(userId)
    const action = currentStatus === 'active' ? 'cancel' : 'activate'
    
    try {
      const res = await fetch('/api/admin/toggle-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      })

      if (res.ok) {
        setUsers(users.map(u => {
          if (u.id === userId) {
            return {
              ...u,
              subscriptions: {
                ...u.subscriptions,
                status: action === 'activate' ? 'active' : 'canceled'
              }
            }
          }
          return u
        }))
      } else {
        alert('Erreur lors du changement de statut')
      }
    } catch (e) {
      alert('Erreur de requête')
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Action IRREVERSIBLE. Supprimer ce client définitivement ?")) return
    setLoadingId(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId))
      } else {
        const error = await res.json()
        alert(error.message || 'Erreur lors de la suppression')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setLoadingId(null)
    }
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingId('form')
    try {
      const method = editingUser ? 'PUT' : 'POST'
      const body = { 
        ...formData, 
        userId: editingUser?.id 
      }
      
      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        if (editingUser) {
          // Update local state
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, email: formData.email, full_name: formData.full_name } : u))
        } else {
          // Add to local state (needs refresh or mock)
          alert('Utilisateur créé avec succès ! Il a été ajouté sans abonnement.')
          window.location.reload() // Simplest way to get fresh relations
        }
        setIsFormOpen(false)
        setEditingUser(null)
        setFormData({ email: '', full_name: '', password: '' })
      } else {
        alert(data.error || 'Erreur API')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setLoadingId(null)
    }
  }

  const openEdit = (user: any) => {
    setEditingUser(user)
    setFormData({ email: user.email, full_name: user.full_name || '', password: '' })
    setIsFormOpen(true)
  }

  const openAdd = () => {
    setEditingUser(null)
    setFormData({ email: '', full_name: '', password: '' })
    setIsFormOpen(true)
  }

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(search.toLowerCase()) || 
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e293b]/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par email ou nom..." 
              className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={openAdd} className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-lg">
            <UserPlus size={18} /> Ajouter un client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead className="bg-[#0f172a]/50">
              <tr>
                <th>Utilisateur</th>
                <th>Type</th>
                <th>Abonnement Stripe</th>
                <th className="text-right">Actions Manuelles</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => {
                  const isActive = user.subscriptions?.status === 'active' || user.subscriptions?.status === 'trialing'
                  
                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td>
                        <div className="font-semibold text-white">{user.full_name || 'Sans Nom'}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </td>
                      <td>
                        {user.is_admin ? <span className="badge-member bg-indigo-500/10 text-indigo-400 border-indigo-500/20"><Shield size={12} className="inline mr-1" />Admin</span> : <span className="text-slate-400 text-xs text-opacity-70">Client</span>}
                      </td>
                      <td>
                        <span className={`badge-member ${isActive ? 'active' : 'expired'}`}>
                          {isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Toggle Sub Access */}
                          <button 
                            onClick={() => toggleSubscription(user.id, user.subscriptions?.status)}
                            disabled={loadingId === user.id}
                            className={`p-2 rounded-lg text-white transition-colors flex items-center gap-1 ${isActive ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-400' : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400'}`}
                            title={isActive ? "Suspendre l'accès" : "Activer l'accès manuellement"}
                          >
                            {loadingId === user.id ? '...' : (isActive ? <XCircle size={16} /> : <CheckCircle size={16} />)}
                          </button>
                          
                          {/* Edit */}
                          <button onClick={() => openEdit(user)} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-lg transition-colors" title="Modifier le client">
                            <Edit size={16} />
                          </button>
                          
                          {/* Delete */}
                          <button onClick={() => handleDeleteUser(user.id)} disabled={loadingId === user.id} className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg transition-colors" title="Supprimer le client">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AJOUT/EDITION */}
      {isFormOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Overlay avec backdrop-blur global */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
            
            <div className="glass-panel w-full max-w-md p-6 bg-[#1e293b] relative z-[10001] animate-fade-in shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingUser ? 'Modifier le Client' : 'Créer un nouveau Client'}
              </h3>
              
              <form onSubmit={handleSaveUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Nom complet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Mot de passe {editingUser && '(Laissez vide pour ne pas modifier)'}
                  </label>
                  <input 
                    type="text" 
                    required={!editingUser}
                    placeholder={editingUser ? "Nouveau mot de passe..." : "Mot de passe sécurisé..."}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={loadingId === 'form'}
                    className="flex-1 px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition-colors font-semibold shadow-lg"
                  >
                    {loadingId === 'form' ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
