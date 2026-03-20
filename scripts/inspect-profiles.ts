import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5)
  console.log("Profiles:", JSON.stringify(data, null, 2))
  if (error) console.error("Error:", error)
}
run()
