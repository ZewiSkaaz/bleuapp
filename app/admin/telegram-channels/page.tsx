import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TelegramChannelsClient from './TelegramChannelsClient'

export const revalidate = 0

export default async function AdminTelegramChannelsPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile?.is_admin) redirect('/dashboard')

  const { data: channels } = await supabase
    .from('telegram_channels')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <div className="section-header-block mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Signal Bridge</h2>
        <p className="text-slate-400">Connectez, ajoutez ou supprimez vos canaux Telegram sources pour le relais automatique.</p>
      </div>

      <div className="bridge-grid">
        <div className="bridge-column">
          <TelegramChannelsClient initialChannels={channels || []} />
        </div>
      </div>
    </div>
  )
}
