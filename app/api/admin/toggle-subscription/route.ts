import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Helper to get service role client for admin tasks
const getServiceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function POST(request: Request) {
  try {
    const { userId, action } = await request.json()
    const supabase = createServerClient()

    // Verify Admin
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const adminClient = getServiceSupabase()

    // Check if subscription exists
    const { data: existingSub } = await adminClient
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingSub) {
      const newStatus = action === 'activate' ? 'active' : 'canceled'
      const { error } = await adminClient
        .from('subscriptions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
    } else {
      if (action === 'activate') {
        const { error } = await adminClient
          .from('subscriptions')
          .insert({
            user_id: userId,
            status: 'active',
            stripe_customer_id: 'manual_admin_' + Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Toggle Subscription Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
