'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.push('/auth/login')
      return
    }

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (data) setSubscription(data)
  }

  const handleSubscribe = async (plan: 'monthly' | 'yearly' = 'monthly') => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const { url, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      if (url) {
        window.location.href = url
      } else {
        throw new Error('URL de checkout non reçue')
      }
    } catch (err: any) {
      console.error('Error:', err)
      alert(err.message || 'Erreur lors de la création de la session de paiement')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL du portail non reçue')
      }
    } catch (err: any) {
      console.error('Error:', err)
      alert(err.message || 'Erreur lors de l\'ouverture du portail de gestion')
    } finally {
      setLoading(false)
    }
  }

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'

  return (
    <div className="min-h-screen pattern-bg">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Abonnement BleuApp</h1>
          <div className="h-1 w-24 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-white text-opacity-80">
            Choisissez votre plan pour activer le copy-trading instantané
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Statut Card */}
          <div className="card-white flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black mb-6" style={{ color: '#1d4ed8' }}>Votre État Actuel</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Statut du compte</p>
                  <p className="text-3xl font-black">
                    {subscription?.status === 'active' && (
                      <span className="text-green-600">✅ ACTIF</span>
                    )}
                    {subscription?.status === 'trialing' && (
                      <span className="text-blue-600">💎 ESSAI</span>
                    )}
                    {!isActive && subscription?.status !== 'trialing' && (
                      <span className="text-red-600">❌ INACTIF</span>
                    )}
                  </p>
                </div>

                {subscription?.current_period_end && (
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-1">Prochaine échéance</p>
                    <p className="text-2xl font-black text-gray-800">
                      {new Date(subscription.current_period_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              {isActive ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-lg"
                >
                  {loading ? '⏳ Chargement...' : '⚙️ Gérer mon abonnement'}
                </button>
              ) : (
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                  <p className="text-blue-800 font-bold text-center">
                    Sélectionnez un plan à droite pour débloquer toutes les fonctionnalités.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="card-white border-4 border-blue-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-8 py-2 font-black transform rotate-45 translate-x-8 translate-y-4">
              POPULAIRE
            </div>
            
            <h2 className="text-3xl font-black mb-2" style={{ color: '#1d4ed8' }}>🔹 Plan Basique</h2>
            <p className="text-gray-500 font-bold mb-8 text-lg">Tout ce dont vous avez besoin pour copier Sadek</p>
            
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-6xl font-black text-gray-900">29,99€</span>
              <span className="text-2xl font-bold text-gray-400">/ mois</span>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "1 compte de trading connecté",
                "1 canal Telegram de signaux",
                "5 actifs (GOLD, BTC, SOL...)",
                "Exécution instantanée",
                "Support prioritaire"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-gray-700">
                  <span className="text-green-500 text-xl font-black">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {!isActive && (
              <div className="space-y-4">
                <button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-xl shadow-xl transform hover:scale-105 transition-all"
                >
                  {loading ? '⏳ Connexion Stripe...' : "S'abonner maintenant"}
                </button>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={loading}
                  className="w-full text-blue-600 font-black hover:underline py-2"
                >
                  {loading ? '' : "Préférer le plan annuel (275,88€/an) 💎"}
                </button>
              </div>
            )}
          </div>
        </div>

        {!isActive && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-r-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl">⚠️</span>
                <h3 className="text-xl font-black text-red-800 uppercase">Abonnement requis</h3>
              </div>
              <p className="text-red-700 font-bold leading-relaxed">
                Votre compte n'est pas encore activé. Sans abonnement, les signaux Telegram ne seront pas copiés sur votre compte MT5.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

