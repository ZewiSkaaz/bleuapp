# Guide de Déploiement : BleuApp

**IMPORTANT : BleuApp doit être considéré comme un projet 100% concurrent. Vous ne devez ABSOLUMENT PAS partager la même base de données ou le même serveur que l'ancienne application L'IMPRIMANTE.**

## 1. Créer un nouveau projet Supabase
1. Allez sur [Supabase](https://supabase.com/) et créez une **nouvelle organisation** ou un **nouveau projet** nommé `BleuApp`.
2. Allez dans `Project Settings -> API` et copiez les variables suivantes :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Exécutez toutes les migrations de ce dossier dans le SQL Editor de ce *Nouveau* projet Supabase :
   - Vous pouvez coller le contenu des fichiers existants (se trouvant dans le dossier `supabase/migrations/`) l'un après l'autre.
   - N'oubliez pas d'inclure la nouvelle table `telegram_channels`.

## 2. Hébergement du Bot (Render)
1. Allez sur [Render](https://render.com/).
2. Ne réutilisez **pas** le Web Service de L'IMPRIMANTE. Cliquez sur **New -> Web Service**.
3. Connectez votre dépôt GitHub hébergeant spécifiquement le code du bot (le moteur python s'il est séparé, ou ce projet complet).
4. Configurez les variables d'environnement pour qu'elles pointent bien vers la nouvelle base de données Supabase de `BleuApp`.

## 3. Hébergement du Dashboard (Vercel ou Render)
1. Si vous hébergez BleuApp sur [Vercel](https://vercel.com/) (recommandé pour Next.js), créez un **nouveau projet**.
2. Connectez le dépôt Git contenant ce code (celui de BleuApp, dossier actuel).
3. Ajoutez-y vos nouvelles variables `NEXT_PUBLIC_SUPABASE_URL`, et ajoutez aussi vos nouvelles clés Stripe si vous comptez facturer différemment.

## 4. Configuration de Stripe (Optionnel mais recommandé)
1. Si BleuApp est une entité distincte, créez un nouveau compte Stripe (ou sous-compte) pour ne pas mélanger la comptabilité et les abonnements.
2. Ajoutez dans l'hébergeur la clé `STRIPE_SECRET_KEY` et le Webhook Stripe correspondant.

**En résumé, séparez tout : Base de données, Hébergeur (Render/Vercel) et Stripe.**
