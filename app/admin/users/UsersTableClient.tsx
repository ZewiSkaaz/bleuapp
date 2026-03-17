'use client'

import { useState } from 'react'

export default function UsersTableClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const toggleSubscription = async (userId: string, currentStatus: string) => {
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

  return (
    <table className="min-w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4">Utilisateur</th>
          <th className="text-left py-3 px-4">Email</th>
          <th className="text-left py-3 px-4">Abonnement</th>
          <th className="text-left py-3 px-4">Actions Admin</th>
        </tr>
      </thead>
      <tbody>
        {users && users.length > 0 ? (
          users.map((user: any) => {
            const isActive = user.subscriptions?.status === 'active' || user.subscriptions?.status === 'trialing'
            
            return (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">
                  {user.full_name || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => toggleSubscription(user.id, user.subscriptions?.status)}
                    disabled={loadingId === user.id}
                    className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${
                      isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    } disabled:opacity-50`}
                  >
                    {loadingId === user.id 
                      ? '...' 
                      : (isActive ? 'Désactiver l\'accès' : 'Activer l\'accès')}
                  </button>
                </td>
              </tr>
            )
          })
        ) : (
          <tr>
            <td colSpan={4} className="py-8 text-center text-gray-500">
              Aucun utilisateur pour le moment
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
