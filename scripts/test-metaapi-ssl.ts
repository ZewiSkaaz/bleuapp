
import https from 'https';


async function testDomains() {
  const token = 'JWT_REDACTED';
  const accountId = '9ff07194-53b2-4e48-8dc3-ef7b5f1a01b7';
  
  const urls = [
    `https://mt-client-api-v1.london.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`,
    `https://mt-client-api-v1.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`,
    `https://mt-provisioning-api-v1.agiliumtrade.ai/users/current/accounts/${accountId}`,
    `https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts/${accountId}`,
  ];

  for (const url of urls) {
    console.log(`\n📡 Testing: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: { 'auth-token': token }
      });

      console.log(`Status: ${response.status}`);
      if (response.status === 200) {
          console.log('✅ Success!');
          const data = await response.json();
          console.log('Data sample:', JSON.stringify(data).substring(0, 100));
      } else {
          const text = await response.text();
          console.log('Body:', text.substring(0, 100));
      }
    } catch (e: any) {
      console.log(`❌ Error: ${e.message}`);
    }
  }
}

testDomains();
