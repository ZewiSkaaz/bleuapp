'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Settings, CheckCircle, AlertTriangle, Zap,
  Server, Database, Globe, Lock, Code, Layers
} from 'lucide-react'

const envVars = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'URL de votre projet Supabase', category: 'Supabase' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', desc: 'Clé publique Supabase (safe browser-side)', category: 'Supabase' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'Clé serveur Supabase (admin access)', category: 'Supabase' },
  { name: 'STRIPE_SECRET_KEY', desc: 'Clé secrète Stripe (sk_live_xxx ou sk_test_xxx)', category: 'Stripe' },
  { name: 'STRIPE_WEBHOOK_SECRET', desc: 'Secret du webhook Stripe (whsec_xxx)', category: 'Stripe' },
  { name: 'STRIPE_PRICE_MONTHLY', desc: 'Price ID du plan mensuel (price_xxx)', category: 'Stripe' },
  { name: 'STRIPE_PRICE_YEARLY', desc: 'Price ID du plan annuel (price_xxx)', category: 'Stripe' },
  { name: 'NEXT_PUBLIC_BASE_URL', desc: 'URL de votre site (https://bleuapp.onrender.com)', category: 'App' },
  { name: 'TELEGRAM_BOT_TOKEN', desc: 'Token du bot Telegram (@BotFather)', category: 'Telegram' },
  { name: 'META_API_TOKEN', desc: 'Token MetaAPI pour le copy trading', category: 'MetaAPI' },
  { name: 'OPENAI_API_KEY', desc: 'Clé OpenAI (optionnel, pour l\'analyse AI)', category: 'Optionnel' },
]

const tables = [
  { name: 'profiles', desc: 'Informations utilisateur (nom, email, is_admin)', color: 'text-blue-400' },
  { name: 'subscriptions', desc: 'Abonnements Stripe (statut, dates, stripe_customer_id)', color: 'text-emerald-400' },
  { name: 'mt5_accounts', desc: 'Comptes MT5 liés (broker, serveur, metaapi_account_id)', color: 'text-amber-400' },
  { name: 'telegram_channels', desc: 'Canaux Telegram sources (chat_id, is_premium, style)', color: 'text-indigo-400' },
  { name: 'telegram_signals', desc: 'Historique des signaux reçus (symbol, action, sl, tp)', color: 'text-violet-400' },
  { name: 'copy_trades', desc: 'Historique des trades copiés (follower, symbol, volume)', color: 'text-rose-400' },
  { name: 'trading_settings', desc: 'Configuration globale du moteur de trading', color: 'text-teal-400' },
]

export default function ArchitectureGuidePage() {
  const categories = [...new Set(envVars.map(v => v.category))]
  
  return (
    <div className="animate-fade-in space-y-8">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-rose-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Settings size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Architecture & Infrastructure</h2>
            <p className="text-rose-400 text-sm font-semibold mt-1">Stack technique, variables et base de données</p>
          </div>
        </div>
      </div>

      {/* Stack */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Layers size={20} className="text-blue-400" /> Stack Technique
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code size={18} className="text-blue-400" />
              <h4 className="font-bold text-white text-sm">Next.js 14</h4>
            </div>
            <p className="text-slate-400 text-xs">Framework React fullstack avec App Router, API Routes et Server Components.</p>
          </div>
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database size={18} className="text-emerald-400" />
              <h4 className="font-bold text-white text-sm">Supabase</h4>
            </div>
            <p className="text-slate-400 text-xs">Base de données PostgreSQL hébergée avec authentification, RLS et API temps réel.</p>
          </div>
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Server size={18} className="text-indigo-400" />
              <h4 className="font-bold text-white text-sm">Render</h4>
            </div>
            <p className="text-slate-400 text-xs">Hébergement cloud avec déploiement automatique depuis GitHub. Auto-scale et SSL inclus.</p>
          </div>
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={18} className="text-violet-400" />
              <h4 className="font-bold text-white text-sm">Stripe</h4>
            </div>
            <p className="text-slate-400 text-xs">Paiements en ligne avec gestion d&apos;abonnements récurrents et webhooks automatiques.</p>
          </div>
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-amber-400" />
              <h4 className="font-bold text-white text-sm">MetaAPI</h4>
            </div>
            <p className="text-slate-400 text-xs">API cloud pour connecter MetaTrader 5. Permet le copy trading et la lecture des positions.</p>
          </div>
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock size={18} className="text-rose-400" />
              <h4 className="font-bold text-white text-sm">Telegram Bot API</h4>
            </div>
            <p className="text-slate-400 text-xs">Bot personnalisé pour intercepter les signaux de trading et les rediffuser aux abonnés.</p>
          </div>
        </div>
      </div>

      {/* Variables d'environnement */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Lock size={20} className="text-amber-400" /> Variables d&apos;Environnement (Render)
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Toutes ces variables doivent être configurées dans votre service Render → Environment.
        </p>
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">{cat}</h4>
              <div className="space-y-2">
                {envVars.filter(v => v.category === cat).map(v => (
                  <div key={v.name} className="flex items-start gap-3 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
                    <code className="text-blue-400 text-xs font-mono bg-blue-500/10 px-2 py-1 rounded flex-shrink-0">{v.name}</code>
                    <span className="text-slate-400 text-xs">{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2 mt-4">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>Ne changez <strong>jamais</strong> les variables NEXT_PUBLIC_ sans redéployer. Elles sont intégrées au build.</span>
        </div>
      </div>

      {/* Tables */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Database size={20} className="text-emerald-400" /> Tables de la Base de Données
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Voici les tables principales de votre base Supabase et leur rôle :
        </p>
        <div className="space-y-2">
          {tables.map(t => (
            <div key={t.name} className="flex items-center gap-3 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
              <code className={`${t.color} text-xs font-mono font-bold min-w-[140px]`}>{t.name}</code>
              <span className="text-slate-400 text-xs">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/admin/aide/facturation" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Facturation & Stripe
        </Link>
        <Link href="/admin/aide" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-1">
          Retour à l&apos;index
        </Link>
      </div>
    </div>
  )
}
