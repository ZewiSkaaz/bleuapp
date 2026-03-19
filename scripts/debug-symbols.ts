
import https from 'https';


async function listSymbols() {
  const token = process.env.METAAPI_TOKEN || 'REPLACEME_METAAPI_TOKEN';
  const accountId = process.env.TEST_METAAPI_ACCOUNT_ID || 'REPLACEME_ACCOUNT_ID';
  const url = `https://mt-client-api-v1.london.agiliumtrade.ai/users/current/accounts/${accountId}/symbols`;

  console.log(`🔍 Querying symbols for account: ${accountId}`);
  
  try {
    const response = await fetch(url, {
      headers: { 'auth-token': token }
    });

    const data = await response.json();
    if (Array.isArray(data)) {
      console.log(`✅ Found ${data.length} symbols.`);
      const eurusdSymbols = data.filter(s => s.includes('EURUSD'));
      const goldSymbols = data.filter(s => s.includes('XAU') || s.includes('GOLD'));
      console.log('EURUSD variations:', eurusdSymbols);
      console.log('GOLD variations:', goldSymbols);
    } else {
      console.log('📄 Response:', JSON.stringify(data, null, 2));
    }
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
  }
}

listSymbols();
