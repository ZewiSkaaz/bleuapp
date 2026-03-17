import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body
    
    const supabase = createRouteHandlerClient({ cookies })

    // Verify Admin
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (action === 'create') {
      const { chat_id, style, prefix } = body
      
      if (!chat_id) {
        return NextResponse.json({ error: 'Chat ID required' }, { status: 400 })
      }

      const { data, error } = await supabase
        .from('telegram_channels')
        .insert({ chat_id, style, prefix })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    if (action === 'delete') {
      const { id } = body
      if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

      const { error } = await supabase
        .from('telegram_channels')
        .delete()
        .eq('id', id)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
