
import https from 'https';


async function inspectAccount() {
  const token = process.env.METAAPI_TOKEN || 'REPLACEME_METAAPI_TOKEN';
  const accountId = process.env.TEST_METAAPI_ACCOUNT_ID || 'REPLACEME_ACCOUNT_ID';
  const url = `https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}`;

  console.log(`🔍 Inspecting account via Provisioning API: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: { 'auth-token': token }
    });

    const data = await response.json();
    console.log('📄 Account Details:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
  }
}

inspectAccount();
