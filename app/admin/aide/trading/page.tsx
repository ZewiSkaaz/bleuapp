'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Database, CheckCircle, ArrowRight, AlertTriangle,
  Zap, Shield, Play, Square, Activity, Target
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
            <h2 className="text-3xl font-extrabold text-white">Copy Trading & MT5</h2>
            <p className="text-amber-400 text-sm font-semibold mt-1">Réplication automatique des trades</p>
          </div>
        </div>
      </div>

      {/* Fonctionnement */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-400" /> Comment fonctionne le Copy Trading ?
        </h3>
        <div className="bg-[#0f172a]/50 rounded-xl p-5 border border-white/5 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center">
            <div className="glass-panel px-4 py-3 text-sm font-bold text-amber-400 flex-1">🏦 Compte Master<br/><span className="text-xs text-slate-400 font-normal">Le trader ouvre un trade</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-blue-400 flex-1">⚡ MetaAPI<br/><span className="text-xs text-slate-400 font-normal">Détecte en temps réel</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-emerald-400 flex-1">👥 Comptes Clients<br/><span className="text-xs text-slate-400 font-normal">Trade répliqué</span></div>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Quand vous (le Master) ouvrez, modifiez ou fermez un trade sur votre compte MT5, 
          MetaAPI le détecte et le réplique instantanément sur tous les comptes clients actifs. 
          Les volumes sont ajustés proportionnellement au capital de chaque client.
        </p>
      </div>

      {/* Connecter un compte */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-amber-400" /> Connecter un Compte Master
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Allez dans <strong className="text-white">Admin → Comptes Master (MT5)</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Cliquez sur <strong className="text-white">&quot;Lier un compte&quot;</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Sélectionnez votre <strong className="text-white">broker</strong> dans la liste (ex: FTMO, IC Markets...)</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Choisissez le <strong className="text-white">serveur</strong> correspondant à votre compte</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Entrez votre <strong className="text-white">identifiant MT5</strong> et <strong className="text-white">mot de passe</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>MetaAPI synchronisera automatiquement votre compte en quelques secondes</span>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>Dès qu&apos;un compte Master est connecté et actif, <strong>chaque trade que vous passez sera automatiquement répliqué</strong>. Assurez-vous que vos credentials sont corrects avant de trader.</span>
        </div>
      </div>

      {/* Contrôles */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Target size={20} className="text-indigo-400" /> Contrôles du Copy Trading
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Play size={18} className="text-emerald-400" />
              <h4 className="font-bold text-emerald-400">Démarrer</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Active le moteur de copy trading. Il surveillera votre compte Master et répliquera  
              tous les nouveaux trades sur les comptes clients actifs.
            </p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Square size={18} className="text-rose-400" />
              <h4 className="font-bold text-rose-400">Arrêter</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Stoppe la surveillance. Les trades ouverts ne seront PAS fermés automatiquement. 
              Chaque client devra fermer ses positions manuellement.
            </p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2 mt-4">
          <Zap size={16} className="mt-0.5 flex-shrink-0" />
          <span>Vous pouvez aussi <strong>Pause / Reprendre</strong> un compte Master individuellement sans affecter les autres.</span>
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
