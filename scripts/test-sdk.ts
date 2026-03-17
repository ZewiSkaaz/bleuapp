
import MetaApi from 'metaapi.cloud-sdk';

async function testWithSDK() {
  const token = 'JWT_REDACTED';
  const api = new MetaApi(token);

  try {
    const accounts = await api.metatraderAccountApi.getAccounts();
    console.log(`✅ Accounts found: ${accounts.length}`);
    
    for (const account of accounts) {
        console.log(`\n--- Account ${account.name} ---`);
        console.log(`ID: ${account.id}`);
        console.log(`Server: ${account.server}`);
        console.log(`State: ${account.state}`);
        console.log(`Type: ${account.type}`);
        
        // Let's try to get account information via the SDK
        const connection = account.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();
        const accountInfo = await connection.getAccountInformation();
        console.log(`Balance: ${accountInfo.balance}`);
        
        // This confirms the connection works via the SDK
    }
  } catch (error) {
    console.error('❌ SDK error:', error);
  }
}

testWithSDK();
