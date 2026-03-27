import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getServiceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// POST: Admin links an MT5 account for a specific client
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { userId, broker_name, server_name, account_number, password } = body

    if (!userId || !broker_name || !server_name || !account_number || !password) {
      return NextResponse.json({ error: 'Tous les champs MT5 sont requis.' }, { status: 400 })
    }

    // 1. Connect to MetaAPI
    let metaapiAccountId = null
    try {
      const metaApiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/metaapi/connect-account`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Admin-Linked - ${broker_name} - ${account_number}`,
            login: account_number,
            password: password,
            server: server_name,
            platform: 'mt5',
            magic: 0,
          }),
        }
      )
      const metaApiData = await metaApiResponse.json()
      if (metaApiData.success && metaApiData.accountId) {
        metaapiAccountId = metaApiData.accountId
      }
    } catch (metaErr) {
      console.warn('MetaAPI connection failed (non-blocking):', metaErr)
    }

    // 2. Insert into Supabase
    const adminDb = getServiceSupabase()
    const passwordEncrypted = Buffer.from(password).toString('base64')

    const { data: newAccount, error: insertError } = await adminDb.from('mt5_accounts').insert({
      user_id: userId,
      broker_name,
      server_name,
      account_number: parseInt(account_number),
      password_encrypted: passwordEncrypted,
      is_investor: false,
      is_admin_account: false,
      metaapi_account_id: metaapiAccountId,
      is_active: true,
    }).select().single()

    if (insertError) throw insertError

    return NextResponse.json({ success: true, account: newAccount })
  } catch (error: any) {
    console.error('Admin Link MT5 Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Admin unlinks an MT5 account 
export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { accountId } = body

    if (!accountId) return NextResponse.json({ error: 'Account ID required' }, { status: 400 })

    const adminDb = getServiceSupabase()
    const { error } = await adminDb.from('mt5_accounts').delete().eq('id', accountId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin Unlink MT5 Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
