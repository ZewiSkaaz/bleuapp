const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read env variables directly
const envFile = fs.readFileSync('/Users/lucie/.gemini/antigravity/sadek-saas-v2/.env.local', 'utf-8');
const envUrl = envFile.split('\n').find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL='))?.split('=')[1]?.trim();
const envKey = envFile.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY='))?.split('=')[1]?.trim();

const supabase = createClient(envUrl, envKey);

async function run() {
  const { data: admins, error: adminErr } = await supabase.from('profiles').select('id, full_name, email').eq('is_admin', true);
  if (adminErr) {
    console.error("Erreur req admins:", adminErr);
    return;
  }
  const adminIds = admins.map(a => a.id);
  console.log(`Admins trouvés: ${admins.length} - `, admins.map(a => a.email).join(', '));
  
  const { data: adminAccounts } = await supabase.from('mt5_accounts').select('*').in('user_id', adminIds).eq('is_active', true);
  console.log('--- ADMIN ACCOUNTS (MASTERS) ---');
  console.log(adminAccounts);

  const { data: clients } = await supabase.from('profiles').select('id').neq('is_admin', true);
  const clientIds = clients.map(c => c.id);

  const { data: clientAccounts } = await supabase.from('mt5_accounts').select('*').in('user_id', clientIds).eq('is_active', true);
  console.log('\n--- CLIENT ACCOUNTS (FOLLOWERS) ---');
  console.log(clientAccounts);

  const { data: subs } = await supabase.from('subscriptions').select('*').in('user_id', clientIds).eq('status', 'active');
  console.log('\n--- ACTIVE CLIENT SUBSCRIPTIONS ---');
  console.log(subs);
}
run();
