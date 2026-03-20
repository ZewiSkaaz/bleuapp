import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Helper to get service role client for admin tasks
const getServiceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// POST: Add new user
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Verify admin
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { email, password, full_name } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const adminAuthClient = getServiceSupabase()
    
    // Create the user in Auth
    const { data, error } = await adminAuthClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (error) throw error

    // Create the default subscription as inactive
    if (data.user) {
      await adminAuthClient.from('subscriptions').insert({
        user_id: data.user.id,
        status: 'canceled',
        stripe_customer_id: 'manual_' + Date.now()
      })
      
      // Upsert profile to guarantee it exists (bypassing potential missing triggers)
      const { error: upsertError } = await adminAuthClient.from('profiles').upsert({ 
        id: data.user.id,
        full_name: full_name || 'Sans Nom',
        email: email,
        is_admin: false
      })
      if (upsertError) throw upsertError
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error: any) {
    console.error('Create User Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT: Edit existing user
export async function PUT(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Verify admin
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { userId, email, password, full_name } = body

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })

    const adminAuthClient = getServiceSupabase()
    
    // Update Auth Email/Password
    const updatePayload: any = {}
    if (email) updatePayload.email = email
    if (password) updatePayload.password = password
    if (full_name) updatePayload.user_metadata = { full_name }

    if (Object.keys(updatePayload).length > 0) {
      const { error: authError } = await adminAuthClient.auth.admin.updateUserById(userId, updatePayload)
      if (authError) throw authError
    }

    // Update Profile Name
    if (full_name) {
      const { error: profileError } = await adminAuthClient.from('profiles').update({ full_name }).eq('id', userId)
      if (profileError) throw profileError
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update User Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE: Delete user
export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Verify admin
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
    if (!profile?.is_admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { userId } = body

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    if (userId === session.user.id) return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })

    const adminAuthClient = getServiceSupabase()
    
    const { error } = await adminAuthClient.auth.admin.deleteUser(userId)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete User Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
