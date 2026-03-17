
import https from 'https';


async function inspectAccount() {
  const token = 'JWT_REDACTED';
  const accountId = '9ff07194-53b2-4e48-8dc3-ef7b5f1a01b7';
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
