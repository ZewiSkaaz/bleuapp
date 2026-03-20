'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Settings, CheckCircle, AlertTriangle, Zap,
  Server, Database, Globe, Lock, Code, Layers, HelpCircle, ArrowRight
} from 'lucide-react'

const envVars = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', desc: 'L\'adresse de votre base de données Supabase', category: 'Supabase' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', desc: 'Clé publique pour que le site puisse lire la base', category: 'Supabase' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', desc: 'LA CLÉ MAITRE (Secrète) : Donne tous les droits admin', category: 'Supabase' },
  { name: 'STRIPE_SECRET_KEY', desc: 'Permet au serveur de parler à Stripe en toute sécurité', category: 'Stripe' },
  { name: 'STRIPE_WEBHOOK_SECRET', desc: 'Le mot de passe pour vérifier que c\'est bien Stripe qui nous parle', category: 'Stripe' },
  { name: 'STRIPE_PRICE_MONTHLY', desc: 'L\'identifiant de votre prix mensuel (price_xxx)', category: 'Stripe' },
  { name: 'STRIPE_PRICE_YEARLY', desc: 'L\'identifiant de votre prix annuel (price_xxx)', category: 'Stripe' },
  { name: 'NEXT_PUBLIC_BASE_URL', desc: 'L\'adresse de votre site (indispensable pour les emails)', category: 'App' },
  { name: 'TELEGRAM_BOT_TOKEN', desc: 'Le code secret de votre bot créé via @BotFather', category: 'Telegram' },
  { name: 'META_API_TOKEN', desc: 'L\'autorisation pour MetaAPI de passer des trades', category: 'MetaAPI' },
]

const tables = [
  { name: 'profiles', desc: 'Le carnet d\'adresses de vos membres (Emails, Noms, Rang Admin)', color: 'text-blue-400' },
  { name: 'subscriptions', desc: 'Le registre des paiements (Qui a payé ? Qui a expiré ?)', color: 'text-emerald-400' },
  { name: 'mt5_accounts', desc: 'Le coffre-fort des clients (Numéro MT5 et Broker)', color: 'text-amber-400' },
  { name: 'telegram_channels', desc: 'La liste des groupes Telegram que le bot doit surveiller', color: 'text-indigo-400' },
  { name: 'telegram_signals', desc: 'Le journal de tous les signaux détectés dans le passé', color: 'text-violet-400' },
  { name: 'copy_trades', desc: 'La preuve de chaque trade envoyé chez chaque client', color: 'text-rose-400' },
]

export default function ArchitectureGuidePage() {
  const categories = Array.from(new Set(envVars.map(v => v.category)))
  
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-rose-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Settings size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">L&apos;Architecture Technique</h2>
            <p className="text-rose-400 text-sm font-semibold mt-1">Comprendre comment les pièces du puzzle s&apos;assemblent</p>
          </div>
        </div>
      </div>

      {/* Intro Box */}
      <div className="glass-panel p-6 bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
        <HelpCircle size={24} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold mb-2">Pourquoi apprendre ça ?</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Vous n&apos;avez pas besoin d&apos;être ingénieur pour gérer BleuApp, mais comprendre "qui fait quoi" vous aidera énormément en cas de problème. C&apos;est comme savoir où se trouve le réservoir d&apos;huile et la batterie dans une voiture : vous ne réparez pas le moteur, mais vous savez quoi vérifier.
          </p>
        </div>
      </div>

      {/* Stack */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Layers size={24} className="text-blue-400" /> 1. Les 3 Piliers (La Stack)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-colors shadow-lg shadow-blue-500/5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <Code size={24} className="text-blue-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Next.js (Le Chef d&apos;Orchestre)</h4>
            <p className="text-slate-400 text-xs leading-relaxed">C&apos;est le code du site. Il décide de ce qui s&apos;affiche à l&apos;écran, gère les connexions et parle à tous les autres services. C&apos;est l&apos;intelligence du système.</p>
          </div>
          
          <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-colors shadow-lg shadow-emerald-500/5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Database size={24} className="text-emerald-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Supabase (La Mémoire)</h4>
            <p className="text-slate-400 text-xs leading-relaxed">C&apos;est votre disque dur géant dans le cloud. Il stocke vos clients, leurs mots de passe (cryptés) et l&apos;historique de tout ce qui se passe sur le site.</p>
          </div>

          <div className="bg-[#0f172a]/80 border border-white/5 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-colors shadow-lg shadow-indigo-500/5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Server size={24} className="text-indigo-400" />
            </div>
            <h4 className="font-bold text-white text-base mb-2">Render (L&apos;Usine)</h4>
            <p className="text-slate-400 text-xs leading-relaxed">C&apos;est l&apos;ordinateur puissant qui fait tourner votre code Next.js 24h/24. Sans Render, votre site n&apos;existerait pas sur Internet.</p>
          </div>
        </div>
      </div>

      {/* Variables d'environnement */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Lock size={24} className="text-amber-400" /> 2. Les Variables d&apos;Environnement
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Imaginez que ce sont les "codes secrets" que vous donnez à Render pour qu&apos;il puisse ouvrir les portes de Stripe, Supabase et Telegram. Sans ces codes, le site est comme une voiture sans clé.
        </p>
        
        <div className="space-y-8">
          {categories.map(cat => (
            <div key={cat} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-slate-700 ml-1">{cat}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {envVars.filter(v => v.category === cat).map(v => (
                  <div key={v.name} className="flex flex-col gap-2 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <code className="text-blue-300 text-[10px] font-mono bg-blue-500/10 px-2 py-1 rounded self-start">{v.name}</code>
                    <span className="text-slate-400 text-xs leading-relaxed">{v.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 mt-8 shadow-lg shadow-amber-500/5">
          <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <div className="leading-relaxed">
            <strong className="text-amber-500 font-bold">Conseil de pro :</strong> <br/>
            Si vous modifiez une variable sur Render, n&apos;oubliez pas que le site doit "redémarrer" pour les prendre en compte. Render le fait généralement tout seul, mais cela prend 1 à 2 minutes.
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Database size={24} className="text-emerald-400" /> 3. Les Tables de Données
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Si vous ouvrez Supabase, vous verrez des "Tables" (comme des fichiers Excel). Voici les plus importantes à connaître :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tables.map(t => (
            <div key={t.name} className="flex items-start gap-4 bg-[#0f172a]/50 px-5 py-4 rounded-2xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${t.color.replace('text', 'bg')} mt-2 shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></div>
              <div>
                <code className={`${t.color} text-sm font-mono font-black block mb-1`}>{t.name}</code>
                <span className="text-slate-400 text-xs leading-relaxed">{t.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8 border-t border-white/10 pt-8">
        <Link href="/admin/aide/facturation" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
          <ChevronLeft size={16} /> Facturation & Stripe
        </Link>
        <Link href="/admin/aide" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl transition-colors flex items-center gap-2">
          Retour à l&apos;Index de l&apos;Aide <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
