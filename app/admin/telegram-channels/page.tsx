import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import TelegramChannelsClient from './TelegramChannelsClient'

export default async function AdminTelegramChannelsPage() {
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

  const { data: channels } = await supabase
    .from('telegram_channels')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Canaux Telegram (Sources de Signaux)</h1>
        
        <p className="text-gray-600 mb-8">
          Ajoutez ici les canaux Telegram depuis lesquels BleuApp lira les signaux pour les copier.
        </p>

        <TelegramChannelsClient initialChannels={channels || []} />
      </div>
    </div>
  )
}
