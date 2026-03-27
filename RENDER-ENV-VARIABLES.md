# Variables d'Environnement pour Render

## 📋 Liste Complète des Variables

Copie-colle ces variables dans Render Dashboard → Environment Variables

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stripe (LIVE)
```
STRIPE_SECRET_KEY=sk_live_REDACTED
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_REDACTED
STRIPE_WEBHOOK_SECRET=whsec_... (à récupérer après configuration du webhook Stripe)
STRIPE_MONTHLY_PRODUCT_ID=prod_... (votre nouveau produit mensuel)
STRIPE_YEARLY_PRODUCT_ID=prod_... (votre nouveau produit annuel)
```

### Telegram
```
TELEGRAM_BOT_TOKEN=TELEGRAM_BOT_TOKEN_REDACTED
```

### OpenAI (ChatGPT)
```
OPENAI_API_KEY=OPENAI_API_KEY_REDACTED
```

### MetaAPI
```
METAAPI_TOKEN=eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGFjNTNmNzA5YWI2NDdlYjlkNTU4ODBhODM5NmY4OSIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVzdC1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJtZXRhc3RhdHMtYXBpIiwibWV0aG9kcyI6WyJtZXRhc3RhdHMtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibXQtbWFuYWdlci1hcGkiLCJtZXRob2RzIjpbIm10LW1hbmFnZXItYXBpOnJlc3Q6ZGVhbGluZzoqOioiLCJtdC1tYW5hZ2VyLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJiaWxsaW5nLWFwaSIsIm1ldGhvZHMiOlsiYmlsbGluZy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfV0sImlnbm9yZVJhdGVMaW1pdHMiOmZhbHNlLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiNThhYzUzZjcwOWFiNjQ3ZWI5ZDU1ODgwYTgzOTZmODkiLCJpYXQiOjE3NzQ2MTQyNTB9.DMNOXbBE_Bpq2exFwRX6lSosH_6Mw0traRZtDT9865H76nvO7eJlywtjnmN_mqbol8MfnqQ6CJyY4ZMR9OB4aj1xXflsSBpbQOzqgJILnMW78pnIEmqX6zLzcVMX4TfiXudXW8FAg7hH-HFrONVO2ACfZPorLOdjV_edFv1T1iPx_AgiagknAinzSmKtWAoNQT2TglRw1le7vsLNt7MqYt8XzAm4SQOvR3W1M-k6kDJqESLJYAhb214V8V9bxNpIFuP_nHxQaWuqOd3BQOxKjYlB3XBOYCITXQhdWK038DyL682J9PJxkQPDi9Sgla8U-CeOBUfUnHRng8V-fTWEMVYuwJZMQySKNHVqhOgM1Al9-PmTnxxj-tfcdf3n-iI8s_MVpoPvTF2iBhS3ZLYUT_iN6jAKYgwTIpFDfnbh8L37Qljiau3eTsWDpLrOYz1GA7AlLF8NlI98JI6prUQGbFslrbmmjzC_a3hpWBfxW3_ucRv6p0es7c4quUYZ1ljBF6Ex_8hvsEU_RnGdx4wpf27NnanNNBHzvY5lPyviW6mBIAiktug8iFk8oWIUGShwH8Rz08eCDaUkz7MDUIzRl1s0-JGp6EW0S9JK7O31674S7TbBKAcRFH6DtqHvLFvoqBNEe5A_yGIjAnierkZtPCpxdIFsCVtacKRTAfuo5K4
```

### App URL
```
NEXT_PUBLIC_APP_URL=https://sadek-bot-saas.onrender.com
```
**⚠️ Important:** Remplace par l'URL réelle générée par Render après le premier déploiement, puis redéploie.
Pour les configurations nécessitant une URL de redirection (par exemple, OAuth), utilise :
- **Site URL** : `https://bleuapp.onrender.com`
- **Redirect URLs** : `https://bleuapp.onrender.com/**`

---

## 🔄 Variables pour le Worker Telegram

Pour le **Background Worker** qui exécute les trades Telegram, tu n'as besoin que de:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
METAAPI_TOKEN=ton_token_metaapi
```

---

## 🔄 Variables pour le Worker Copy Trading

Pour le **Background Worker** de copy trading (si tu le déploies):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
METAAPI_TOKEN=ton_token_metaapi
```

---

## 📝 Notes

- **Ne jamais commit** ces valeurs dans Git
- Utiliser les clés **LIVE** pour la production (pas test)
- Pour les configurations nécessitant une URL de redirection (par exemple, OAuth):
    - **Site URL**: `https://bleuapp.onrender.com`
    - **Redirect URLs**: `https://bleuapp.onrender.com/**`
- `STRIPE_WEBHOOK_SECRET` sera disponible après avoir créé le webhook dans Stripe
- `NEXT_PUBLIC_APP_URL` doit être mis à jour après le premier déploiement
