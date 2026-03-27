'use client'

import { useState } from 'react'
import { MoreVertical, Edit, Trash2, Shield, Search, Plus, UserPlus, CheckCircle, XCircle, ChevronDown, ChevronUp, Activity, Server, AlertCircle, Link2, Unlink, RefreshCw } from 'lucide-react'
import ModalPortal from '@/components/ModalPortal'

export default function UsersTableClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({ email: '', full_name: '', password: '' })
  
  // MT5 Link modal state
  const [isMt5ModalOpen, setIsMt5ModalOpen] = useState(false)
  const [mt5TargetUserId, setMt5TargetUserId] = useState<string | null>(null)
  const [mt5Form, setMt5Form] = useState({ broker_name: '', server_name: '', account_number: '', password: '' })
  const [mt5Loading, setMt5Loading] = useState(false)
  const [mt5Error, setMt5Error] = useState('')

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
          setUsers(users.map(u => u.id === editingUser.id ? { ...u, email: formData.email, full_name: formData.full_name } : u))
        } else {
          alert('Utilisateur créé avec succès !')
          window.location.reload()
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

  // ─── MT5 MANAGEMENT ───────────────────────────────────
  const openMt5Link = (userId: string) => {
    setMt5TargetUserId(userId)
    setMt5Form({ broker_name: '', server_name: '', account_number: '', password: '' })
    setMt5Error('')
    setIsMt5ModalOpen(true)
  }

  const handleLinkMt5 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mt5TargetUserId) return
    setMt5Loading(true)
    setMt5Error('')

    try {
      const res = await fetch('/api/admin/mt5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: mt5TargetUserId,
          ...mt5Form
        })
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Update local user state to reflect the new MT5 account
        setUsers(users.map(u => {
          if (u.id === mt5TargetUserId) {
            return {
              ...u,
              mt5_accounts: [...(u.mt5_accounts || []), data.account]
            }
          }
          return u
        }))
        setIsMt5ModalOpen(false)
        setMt5TargetUserId(null)
      } else {
        setMt5Error(data.error || 'Une erreur est survenue lors de la connexion MetaAPI.')
      }
    } catch (err) {
      setMt5Error('Erreur réseau. Veuillez réessayer.')
    } finally {
      setMt5Loading(false)
    }
  }

  const handleUnlinkMt5 = async (accountId: string, userId: string) => {
    if (!window.confirm("Délier ce compte MT5 du client ? L'accès sera interrompu.")) return
    setLoadingId(accountId)

    try {
      const res = await fetch('/api/admin/mt5', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId })
      })

      if (res.ok) {
        setUsers(users.map(u => {
          if (u.id === userId) {
            return {
              ...u,
              mt5_accounts: (u.mt5_accounts || []).filter((a: any) => a.id !== accountId)
            }
          }
          return u
        }))
      } else {
        alert('Erreur lors de la suppression du compte MT5.')
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

  const inputClass = "w-full bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"

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
                  const mt5Count = user.mt5_accounts?.length || 0
                  
                  return (
                    <>
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}>
                      <td>
                        <div className="font-semibold text-white">{user.full_name || 'Sans Nom'}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                        {mt5Count > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-blue-400 font-medium uppercase tracking-wider">
                            <Server size={10} /> {mt5Count} compte{mt5Count > 1 ? 's' : ''} MT5
                          </div>
                        )}
                      </td>
                      <td>
                        {user.is_admin ? (
                          <span className="badge-member bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                            <Shield size={12} className="inline mr-1" />Admin
                          </span>
                        ) : isActive ? (
                          <span className="badge-member bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            ✨ Payé
                          </span>
                        ) : (
                          <span className="badge-member bg-slate-500/10 text-slate-400 border-slate-500/20">
                            🆓 Gratuit
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge-member ${isActive ? 'active' : 'expired'}`}>
                          {isActive ? 'Abonnement Actif' : 'Pas d\'abonnement'}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2 transition-opacity">
                          {/* Toggle Sub Access */}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSubscription(user.id, user.subscriptions?.status);
                            }}
                            disabled={loadingId === user.id}
                            className={`p-2 rounded-lg text-white transition-colors flex items-center gap-1 ${isActive ? 'bg-amber-500/20 hover:bg-amber-500/40 text-amber-400' : 'bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400'}`}
                            title={isActive ? "Suspendre l'accès" : "Activer l'accès manuellement"}
                          >
                            {loadingId === user.id ? '...' : (isActive ? <XCircle size={16} /> : <CheckCircle size={16} />)}
                          </button>
                          
                          {/* Edit */}
                           <button 
                             type="button"
                             onClick={(e) => {
                               e.stopPropagation();
                               openEdit(user);
                             }} 
                             className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-lg transition-colors" 
                             title="Modifier le client"
                           >
                             <Edit size={16} />
                           </button>
                          
                           {/* Link MT5 */}
                           <button 
                             type="button"
                             onClick={(e) => {
                               e.stopPropagation();
                               openMt5Link(user.id);
                             }} 
                             className="p-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 rounded-lg transition-colors" 
                             title="Lier un compte MT5"
                           >
                             <Link2 size={16} />
                           </button>

                           {/* Delete */}
                           <button 
                             type="button"
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDeleteUser(user.id);
                             }} 
                             disabled={loadingId === user.id} 
                             className="p-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg transition-colors" 
                             title="Supprimer le client"
                           >
                             <Trash2 size={16} />
                           </button>

                           {/* Expand toggle */}
                           <button 
                             type="button"
                             className="p-2 text-slate-400 hover:text-white transition-colors"
                           >
                             {expandedUserId === user.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                           </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded MT5 Details Row */}
                    {expandedUserId === user.id && (
                      <tr className="bg-[#1e293b]/50 border-b border-[#334155]/50 animate-fade-in relative z-10 shadow-inner">
                        <td colSpan={4} className="px-6 py-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider">
                              <Activity size={16} className="text-blue-400" />
                              Comptes MT5 Connectés ({mt5Count})
                            </div>
                            <button
                              type="button"
                              onClick={() => openMt5Link(user.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-lg"
                            >
                              <Plus size={14} /> Lier un compte
                            </button>
                          </div>
                          
                          {(!user.mt5_accounts || user.mt5_accounts.length === 0) ? (
                            <div className="text-slate-500 text-sm italic flex items-center gap-2 bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-700 w-max">
                              <AlertCircle size={14} className="text-amber-500" /> Ce client n'a connecté aucun compte MetaTrader.
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {user.mt5_accounts.map((acc: any) => (
                                <div key={acc.id} className="bg-[#0f172a] p-5 rounded-2xl border border-white/10 relative overflow-hidden group shadow-lg">
                                  {/* Connection Status indicator */}
                                  <div className="absolute top-0 right-0 p-4">
                                    <div className={`w-2.5 h-2.5 rounded-full ${acc.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-blue-400 font-bold text-lg mb-1">
                                    <Server size={18} />
                                    {acc.broker_name || 'Broker Inconnu'}
                                  </div>
                                  <div className="text-slate-300 font-mono text-base mb-4 bg-white/5 inline-block px-3 py-1 rounded-md">
                                    {acc.account_number}
                                  </div>
                                  
                                  <div className="text-sm text-slate-400 space-y-2 mb-4">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                      <span>Serveur:</span>
                                      <span className="text-white font-medium">{acc.server_name || 'Non spécifié'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                      <span>MetaAPI:</span>
                                      <span className={`font-mono truncate max-w-[120px] text-right ${acc.metaapi_account_id ? 'text-emerald-400' : 'text-amber-400'}`} title={acc.metaapi_account_id}>
                                        {acc.metaapi_account_id ? '✓ Connecté' : '⚠ Non provisionné'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Unlink button */}
                                  <button
                                    type="button"
                                    onClick={() => handleUnlinkMt5(acc.id, user.id)}
                                    disabled={loadingId === acc.id}
                                    className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold transition-all"
                                  >
                                    {loadingId === acc.id ? <RefreshCw size={12} className="animate-spin" /> : <Unlink size={12} />}
                                    Délier ce compte
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                    </>
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

      {/* MODAL AJOUT/EDITION CLIENT */}
      {isFormOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
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
                    className={inputClass}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className={inputClass}
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
                    className={inputClass}
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

      {/* MODAL LIER UN COMPTE MT5 */}
      {isMt5ModalOpen && (
        <ModalPortal>
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMt5ModalOpen(false)}></div>
            
            <div className="glass-panel w-full max-w-lg p-6 bg-[#1e293b] relative z-[10001] animate-fade-in shadow-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Link2 className="text-cyan-400" size={22} /> Lier un Compte MT5
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                Connectez le terminal MetaTrader de ce client à la plateforme BleuApp.
              </p>

              {mt5Error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl mb-4 flex items-start gap-2 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> {mt5Error}
                </div>
              )}
              
              <form onSubmit={handleLinkMt5} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">
                      Broker <span className="text-rose-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: VTMarkets"
                      value={mt5Form.broker_name}
                      onChange={e => setMt5Form({...mt5Form, broker_name: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">
                      Serveur <span className="text-rose-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: VTMarkets-Demo"
                      value={mt5Form.server_name}
                      onChange={e => setMt5Form({...mt5Form, server_name: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">
                      Login MT5 <span className="text-rose-400">*</span>
                    </label>
                    <input 
                      type="number" 
                      required
                      placeholder="1077754"
                      value={mt5Form.account_number}
                      onChange={e => setMt5Form({...mt5Form, account_number: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">
                      Mot de passe MT5 <span className="text-rose-400">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Mot de passe"
                      value={mt5Form.password}
                      onChange={e => setMt5Form({...mt5Form, password: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-200 flex gap-2">
                  <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span>Le compte sera automatiquement provisionné via MetaAPI et lié à ce client dans notre base de données.</span>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsMt5ModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={mt5Loading}
                    className="flex-1 px-4 py-2 rounded-xl text-white bg-cyan-600 hover:bg-cyan-500 transition-colors font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    {mt5Loading ? (
                      <><RefreshCw size={14} className="animate-spin" /> Connexion...</>
                    ) : (
                      <><Link2 size={14} /> Lier le compte</>
                    )}
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
