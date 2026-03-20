'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Database, CheckCircle, ArrowRight, AlertTriangle,
  Zap, Shield, Activity, Target, Users, HelpCircle
} from 'lucide-react'

export default function TradingGuidePage() {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-amber-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Database size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Copy Trading & Comptes MT5</h2>
            <p className="text-amber-400 text-sm font-semibold mt-1">Le pont d'exécution vers l'argent réel</p>
          </div>
        </div>
      </div>

      {/* Intro Box */}
      <div className="glass-panel p-6 bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
        <HelpCircle size={24} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold mb-2">Comprendre comment l'ordre arrive chez le broker</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Vous avez le robot Telegram qui attrape l'ordre ("ACHAT USDJPY"), mais ce robot n'est pas branché à la bourse. C'est là qu'intervient le système de Copy Trading. L'objectif est de prendre ce texte et de le forcer dans l'application MetaTrader 5 (MT5) du client, comme s'il tapait sur les boutons lui-même.
          </p>
        </div>
      </div>

      {/* MetaAPI */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Target size={24} className="text-violet-400" /> 1. Qu'est-ce que MetaAPI ?
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Il est très difficile pour un site web de parler directement à MetaTrader. MetaAPI est une entreprise (metaapi.cloud) qui fournit ce pont magique. Sans eux, impossible d'exécuter des trades.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-5 shadow-lg shadow-blue-500/5">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap size={20} className="text-blue-400" />
            </div>
            <h4 className="font-bold text-blue-400 mb-2">Leur rôle</h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              MetaAPI crée des "terminaux MetaTrader virtuels" dans le cloud. Lorsqu'un de vos clients entre ses identifiants MT5, MetaAPI connecte son compte à ce terminal virtuel 24h/24, prêt à recevoir les ordres du webhook BleuApp à la vitesse de la lumière.
            </p>
          </div>
          <div className="bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-5 shadow-lg shadow-amber-500/5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
              <Shield size={20} className="text-amber-400" />
            </div>
            <h4 className="font-bold text-amber-400 mb-2">Prérequis Admin</h4>
            <div className="text-slate-300 text-xs leading-relaxed space-y-2">
              <p>Il vous faut obligatoirement un compte sur metaapi.cloud.</p>
              <p>Une fois inscrit, naviguez vers Auth {'>'} API Tokens. Générez un jeton, et copiez-le dans la variable <code className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">META_API_TOKEN</code> de votre serveur (Render/Vercel).</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connecter un compte client */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Users size={24} className="text-emerald-400" /> 2. Comment le client relie son compte de Trading ?
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          C'est très simple pour vos clients. Ils se connectent à leur espace personnel sur votre site BleuApp, vont dans "Mon Compte MT5", et remplissent ceci :
        </p>
        
        <div className="bg-[#0f172a]/50 p-6 rounded-xl border border-white/5 space-y-4 mb-8 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 hidden sm:block">
            <Database size={100} />
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">1</div>
            <div>
              <strong className="text-white block mb-1">Nom du Broker</strong>
              <span className="text-sm text-slate-400">Le courtier chez qui il a son argent (ex: IC Markets, FTMO, Vantage...)</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">2</div>
            <div>
              <strong className="text-white block mb-1">Serveur du Broker</strong>
              <span className="text-sm text-slate-400">Exemple: ICMarkets-Live23. Très important car chaque courtier a plusieurs serveurs.</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-white shrink-0">3</div>
            <div>
              <strong className="text-white block mb-1">Login (Numéro de compte)</strong>
              <span className="text-sm text-slate-400">Son numéro de compte MT5 fourni par son broker (généralement 7 ou 8 chiffres).</span>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center font-bold text-red-400 shrink-0">4</div>
            <div>
              <strong className="text-white block mb-1">Mot de passe TRADER (Très important)</strong>
              <span className="text-sm text-slate-400">C'est la cause numéro 1 d'échec d'exécution :</span>
              <div className="mt-2 bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg flex gap-2 w-full max-w-xl">
                <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={16} />
                <span className="text-rose-200 text-xs leading-relaxed">
                  MetaTrader donne DEUX mots de passe. Un mot de passe <strong>Investisseur</strong> (qui permet juste de REGARDER les trades) et un mot de passe <strong>Trader principal</strong> (qui permet d'ACHETER/VENDRE). <br/><br/>
                  Si le client met son mot de passe Investisseur, BleuApp ne pourra pas exécuter les trades pour lui ! Il doit absolument mettre le mot de passe Trader.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin : vue des comptes */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Shield size={24} className="text-indigo-400" /> 3. Votre vue Administrateur
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Une fois que vos clients se branchent, vous pourrez voir l'état de leurs comptes MT5 directement depuis la page <strong className="text-white">Admin {'>'} Comptes Master MT5</strong> (bientôt renommée Comptes Clients MT5).
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
              <span className="text-emerald-400 text-xl">🟢</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Status Déployé</p>
              <p className="text-xs text-slate-400 mt-1">Le compte est connecté à MetaAPI avec succès. Prêt à trader.</p>
            </div>
          </div>
          
          <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
              <span className="text-rose-400 text-xl">🔴</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Status Failed / Invalide</p>
              <p className="text-xs text-slate-400 mt-1">Le mot de passe (ou serveur) du client est faux. MetaAPI n'arrive pas à se connecter.</p>
            </div>
          </div>
        </div>

        <p className="text-slate-400 text-sm mt-6 mb-2">💡 Bon à savoir :</p>
        <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
          <li>BleuApp ne retire <strong>aucun fond</strong> au client (MetaAPI n'a pas accès aux transferts d'argent).</li>
          <li>Un client peut connecter avec succès son compte MT5, mais <strong>s'il n'a pas</strong> de pastille verte "Actif" dans <em>Gestion des Clients</em>, ses trades ne seront pas copiés. Le pont saute s'il ne paie pas.</li>
        </ul>
      </div>

      <div className="flex justify-between mt-8 border-t border-white/10 pt-8">
        <Link href="/admin/aide/signaux" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
          <ChevronLeft size={16} /> Configurer les Signaux
        </Link>
        <Link href="/admin/aide/facturation" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl transition-colors flex items-center gap-2">
          Suivant : Facturation & Stripe <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
