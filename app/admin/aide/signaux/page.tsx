'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Zap, CheckCircle, ArrowRight, AlertTriangle,
  MessageSquare, Radio, Shield, Eye, Wifi
} from 'lucide-react'

export default function SignauxGuidePage() {
  return (
    <div className="animate-fade-in space-y-8">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-indigo-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Configuration des Signaux</h2>
            <p className="text-indigo-400 text-sm font-semibold mt-1">Telegram Bridge & Relais Automatique</p>
          </div>
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Radio size={20} className="text-blue-400" /> Comment fonctionne le Signal Bridge ?
        </h3>
        <div className="bg-[#0f172a]/50 rounded-xl p-5 border border-white/5 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="glass-panel px-4 py-3 text-sm font-bold text-indigo-400">📡 Canal Source<br/><span className="text-xs text-slate-400 font-normal">Votre canal VIP</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-blue-400">🤖 Bot BleuApp<br/><span className="text-xs text-slate-400 font-normal">Intercepte & analyse</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-emerald-400">📬 Clients Abonnés<br/><span className="text-xs text-slate-400 font-normal">Reçoivent le signal</span></div>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Le bot BleuApp écoute vos canaux Telegram sources. Quand un nouveau message/signal arrive, il est analysé, 
          reformaté et transmis automatiquement à tous vos clients ayant un abonnement actif.
        </p>
      </div>

      {/* Ajouter un canal */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Wifi size={20} className="text-emerald-400" /> Ajouter un Canal Source
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Allez dans <strong className="text-white">Admin → Canaux Telegram</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Remplissez le <strong className="text-white">nom du canal</strong> (affiché en interne)</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Entrez le <strong className="text-white">Chat ID</strong> du canal (commence par -100...)</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Choisissez le <strong className="text-white">type d&apos;accès</strong> : Premium (payant) ou Gratuit</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Sélectionnez le <strong className="text-white">style de formatage</strong> du bot</span>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>Le bot doit être <strong>administrateur</strong> du canal source pour pouvoir lire les messages. Sans cela, il ne pourra pas intercepter les signaux.</span>
        </div>
      </div>

      {/* Types de canaux */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-violet-400" /> Types d&apos;Accès
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
            <h4 className="font-bold text-amber-400 text-lg mb-2">💎 Premium (Payant)</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Seuls les clients avec un abonnement Stripe actif (ou activés manuellement) recevront les signaux de ce canal. 
              C&apos;est le mode standard pour monétiser votre service.
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
            <h4 className="font-bold text-blue-400 text-lg mb-2">🔓 Gratuit (Public)</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tous les utilisateurs inscrits (même sans abonnement) recevront les signaux de ce canal.
              Utile pour des canaux de news ou d&apos;analyse gratuite qui attirent de nouveaux prospects.
            </p>
          </div>
        </div>
      </div>

      {/* Monitoring */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Eye size={20} className="text-blue-400" /> Surveillance & Logs
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Utilisez la section <strong className="text-white">Logs & Terminal</strong> pour surveiller en temps réel :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 text-sm text-slate-300 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-emerald-400">✅</span> Signaux reçus avec succès
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-blue-400">📨</span> Nouveaux comptes utilisateurs
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-amber-400">⚠️</span> Erreurs de livraison
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-rose-400">🔄</span> Resynchronisations webhook
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/admin/aide/clients" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Gestion des Clients
        </Link>
        <Link href="/admin/aide/trading" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-1">
          Copy Trading & MT5 <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
