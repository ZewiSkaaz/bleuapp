import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  const { data: adminMt5Account } = await supabase
    .from('mt5_accounts')
    .select('id, account_number, broker_name, server_name, is_active')
    .eq('user_id', session.user.id)
    .eq('is_active', true)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-primary-900 mb-4">Dashboard Admin BleuApp</h1>
          <p className="text-lg text-gray-600">Gérez votre application simplement, en quelques clics.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Action 1: Gérer les Clients */}
          <div className="card-white flex flex-col justify-between hover:shadow-2xl transition-shadow border-t-4 border-primary-500">
            <div>
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold mb-2 text-primary-800">Gérer les Clients</h2>
              <p className="text-gray-600 mb-6">
                Voir tous les utilisateurs, activer ou désactiver manuellement leurs accès sans passer par Stripe.
              </p>
            </div>
            <Link href="/admin/users" className="btn btn-primary w-full text-center">
              Ouvrir la gestion des clients
            </Link>
          </div>

          {/* Action 2: Contrôler le Bot */}
          <div className="card-white flex flex-col justify-between hover:shadow-2xl transition-shadow border-t-4 border-primary-500">
            <div>
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold mb-2 text-primary-800">Canaux Telegram</h2>
              <p className="text-gray-600 mb-6">
                Ajouter ou supprimer les sources Telegram pour les signaux (ex: signaux vision, signaux vip).
              </p>
            </div>
            <Link href="/admin/telegram-channels" className="btn btn-primary w-full text-center">
              Gérer les canaux Telegram
            </Link>
          </div>

          {/* Action 3: Compte Master */}
          <div className="card-white flex flex-col justify-between hover:shadow-2xl transition-shadow border-t-4 border-primary-500 md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-6 md:mb-0 md:pr-8">
                <div className="text-4xl mb-4">🏦</div>
                <h2 className="text-2xl font-bold mb-2 text-primary-800">Compte Master (MT5)</h2>
                <p className="text-gray-600">
                  C'est depuis ce compte que les trades seront copiés vers vos clients. 
                </p>
                {adminMt5Account ? (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg inline-block border border-green-200">
                    <p className="font-semibold text-green-800">
                      ✓ Connecté : {adminMt5Account.broker_name} (#{adminMt5Account.account_number})
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg inline-block border border-red-200">
                    <p className="font-semibold text-red-800">
                      ⚠️ Aucun compte Master configuré.
                    </p>
                  </div>
                )}
              </div>
              <Link href="/mt5-accounts" className="btn btn-primary whitespace-nowrap">
                {adminMt5Account ? 'Modifier mon compte' : 'Connecter mon compte'}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

