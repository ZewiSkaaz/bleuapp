# 📂 Projet BleuApp - Résumé d'Archivage

Ce projet a été mis en pause le **30 Mars 2026** après une phase complète de rebranding et d'audit UX.

## 🚀 État Actuel du Projet
- **Nom du Projet** : BleuApp (anciennement Sadek SaaS)
- **Hébergement** : Déployé sur **Render** (`https://bleuapp.onrender.com`)
- **Base de données** : Supabase
- **GitHub** : `main` est à jour avec toutes les dernières fonctionnalités.

## ✅ Dernières Améliorations
1. **Rebranding Complet** : Suppression de toutes les références à "Sadek", passage au nom "BleuApp".
2. **Design Premium** : Migration vers un thème **Dark Glassmorphism** (bleu/indigo sombre) sur toutes les pages client (`/dashboard`, `/mt5-accounts`, `/subscription`).
3. **Gestion MT5 Admin** : Ajout d'un système complet dans le panel admin (`/admin/users`) pour lier/délier des comptes MT5 pour les clients via MetaAPI.
4. **Correction des Variables** : `OPENAI_API_KEY` et `NEXT_PUBLIC_APP_URL` ont été configurées directement sur le dashboard Render.

## 🔑 Points de Vigilance (Pour la reprise)
- **Stripe** : La configuration Stripe est présente mais **Stripe Webhook** est marqué comme "Inactif" dans les paramètres (à configurer dans le dashboard Stripe si vous activez les paiements réels).
- **MetaAPI** : Le token est configuré et fonctionnel.
- **Paramètres Admin** : Accessible via `/admin/settings` pour vérifier l'état des services.

## 🛠 Comment reprendre le travail
1. Cloner le repo si nécessaire.
2. Lancer `npm install`.
3. Lancer `npm run dev`.
4. Pour le déploiement, chaque `git push origin main` déclenche un build sur Render.

---
*Projet archivé et prêt pour une reprise ultérieure.*
