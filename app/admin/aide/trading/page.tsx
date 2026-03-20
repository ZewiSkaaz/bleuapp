'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Database, CheckCircle, ArrowRight, AlertTriangle,
  Zap, Shield, Activity, Target, Users
} from 'lucide-react'

export default function TradingGuidePage() {
  return (
    <div className="animate-fade-in space-y-8">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Database size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Comptes MT5 Clients</h2>
            <p className="text-amber-400 text-sm font-semibold mt-1">Gestion des comptes où les trades sont exécutés</p>
          </div>
        </div>
      </div>

      {/* Fonctionnement */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-400" /> Comment ça fonctionne ?
        </h3>
        <div className="bg-[#0f172a]/50 rounded-xl p-5 border border-white/5 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center">
            <div className="glass-panel px-4 py-3 text-sm font-bold text-indigo-400 flex-1">📡 Canal Telegram<br/><span className="text-xs text-slate-400 font-normal">Signal de trading publié</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-blue-400 flex-1">🤖 Bot BleuApp<br/><span className="text-xs text-slate-400 font-normal">Intercepte, parse le signal</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-emerald-400 flex-1">📊 Comptes MT5 Clients<br/><span className="text-xs text-slate-400 font-normal">Trade exécuté via MetaAPI</span></div>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Les signaux de trading proviennent de vos <strong className="text-white">canaux Telegram sources</strong>. 
          Le bot BleuApp intercepte ces signaux, les analyse (symbole, direction, SL/TP), 
          puis exécute automatiquement le trade sur les <strong className="text-white">comptes MT5 de vos clients abonnés</strong> via MetaAPI.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2 mt-4">
          <Zap size={16} className="mt-0.5 flex-shrink-0" />
          <span>Les comptes MT5 ici sont ceux de vos <strong>clients</strong>, pas un compte maître. Chaque client connecte son propre compte pour recevoir les trades automatiquement.</span>
        </div>
      </div>

      {/* Connecter un compte client */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-amber-400" /> Connecter le Compte MT5 d&apos;un Client
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Le client se connecte à BleuApp et accède à la page <strong className="text-white">Comptes MT5</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Il clique sur <strong className="text-white">&quot;Lier un compte&quot;</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Il sélectionne son <strong className="text-white">broker</strong> (ex : FTMO, IC Markets...)</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Il choisit le <strong className="text-white">serveur</strong> correspondant</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Il entre ses <strong className="text-white">identifiants MT5</strong> (login + mot de passe)</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>MetaAPI synchronise le compte — les trades seront exécutés automatiquement</span>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>Le client doit utiliser son <strong>mot de passe Trader</strong> (pas Investor) pour que les trades puissent être exécutés sur son compte.</span>
        </div>
      </div>

      {/* Admin : vue des comptes */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-indigo-400" /> Vue Admin des Comptes MT5
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          En tant qu&apos;admin, la page <strong className="text-white">Comptes MT5 Clients</strong> vous permet de :
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-emerald-400">👁️</span>
            <span className="text-slate-300 text-sm">Voir tous les comptes MT5 connectés par vos clients</span>
          </div>
          <div className="flex items-start gap-3 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-blue-400">📊</span>
            <span className="text-slate-300 text-sm">Vérifier le statut de connexion de chaque compte (actif/inactif)</span>
          </div>
          <div className="flex items-start gap-3 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-amber-400">⚙️</span>
            <span className="text-slate-300 text-sm">Lier un compte manuellement pour un client (si besoin)</span>
          </div>
          <div className="flex items-start gap-3 bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <span className="text-rose-400">🗑️</span>
            <span className="text-slate-300 text-sm">Supprimer un compte MT5 déconnecté ou problématique</span>
          </div>
        </div>
      </div>

      {/* MetaAPI */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target size={20} className="text-violet-400" /> MetaAPI : le pont entre Telegram et MT5
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          MetaAPI est le service cloud qui permet à BleuApp de communiquer avec les comptes MetaTrader 5 de vos clients. 
          Sans MetaAPI, les signaux Telegram ne pourraient pas être exécutés automatiquement.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h4 className="font-bold text-blue-400 mb-2">Ce que fait MetaAPI :</h4>
            <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
              <li>Connecte les comptes MT5 via API cloud</li>
              <li>Exécute les ordres BUY/SELL</li>
              <li>Surveille les positions ouvertes</li>
              <li>Ferme les positions quand le signal le demande</li>
            </ul>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <h4 className="font-bold text-amber-400 mb-2">Configuration requise :</h4>
            <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
              <li>Compte metaapi.cloud avec token API</li>
              <li>Variable Render : <code className="bg-amber-500/20 px-1 rounded">META_API_TOKEN</code></li>
              <li>Comptes MT5 des clients liés via l&apos;interface</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/admin/aide/signaux" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Configuration des Signaux
        </Link>
        <Link href="/admin/aide/facturation" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-1">
          Facturation & Stripe <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
