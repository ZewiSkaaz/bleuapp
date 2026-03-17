
import https from 'https';


async function listSymbols() {
  const token = 'JWT_REDACTED';
  const accountId = '9ff07194-53b2-4e48-8dc3-ef7b5f1a01b7';
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
