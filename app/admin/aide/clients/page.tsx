'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Users, UserPlus, XCircle, CheckCircle, 
  Edit, Trash2, Shield, CreditCard, ArrowRight, AlertTriangle, Zap, HelpCircle
} from 'lucide-react'

export default function ClientsGuidePage() {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Users size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Gestion des Clients</h2>
            <p className="text-emerald-400 text-sm font-semibold mt-1">Gérez facilement vos utilisateurs, abonnements et accès</p>
          </div>
        </div>
      </div>

      {/* Intro Box */}
      <div className="glass-panel p-6 bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
        <HelpCircle size={24} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold mb-2">Stripe vs. Ajout Manuel</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Dans BleuApp, il existe deux façons de faire entrer un client sur votre plateforme :
          </p>
          <ul className="space-y-2 text-sm text-slate-300 list-disc ml-4">
            <li><strong>Automatique via Stripe :</strong> Le client clique sur un lien de paiement sur votre site vitrine, paie, et son compte est créé automatiquement. Son statut d'abonnement se mettra à jour tout seul.</li>
            <li><strong>Manuel via l'Admin :</strong> Vous ajoutez un client manuellement. Il n'aura <strong className="text-amber-400">PAS d'abonnement Stripe</strong>. C'est à vous de l'activer ou de le désactiver à la main. Idéal pour des testeurs ou vos amis.</li>
          </ul>
        </div>
      </div>

      {/* Section: Ajouter un client */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <UserPlus size={24} className="text-blue-400" /> 1. Ajouter un Client Manuellement
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Voici comment inviter quelqu'un gratuitement sur votre plateforme, sans qu'il n'ait à sortir sa carte bancaire.
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-[#0f172a]/50 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">1</div>
            <span className="text-slate-300 text-sm leading-relaxed">Allez dans le menu de gauche et cliquez sur <strong className="text-white">Membres & Accès</strong>.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#0f172a]/50 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">2</div>
            <span className="text-slate-300 text-sm leading-relaxed">Cliquez sur le gros bouton bleu <strong className="text-white">&quot;Ajouter un client&quot;</strong> en haut à droite de l'écran.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#0f172a]/50 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">3</div>
            <span className="text-slate-300 text-sm leading-relaxed">Remplissez ses informations (Nom complet, Email, Mot de passe). Mémorisez le mot de passe pour le lui donner.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#0f172a]/50 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">4</div>
            <span className="text-slate-300 text-sm leading-relaxed">Une fois ajouté, le client apparaîtra dans la liste avec une pastille grise "Aucun".</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#0f172a]/50 rounded-lg border border-white/5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5 shrink-0">5</div>
            <span className="text-slate-300 text-sm leading-relaxed">Passez votre souris sur sa ligne, et cliquez sur la coche verte (✔) pour <strong className="text-emerald-400">Activer son accès</strong> manuellement !</span>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 shadow-lg shadow-amber-500/5">
          <Zap size={20} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <span className="leading-relaxed">Tant que le compte d'un client manuel n'est pas "Actif", aucun signal Telegram ne sera copié vers son MetaTrader.</span>
        </div>
      </div>

      {/* Section: Statuts */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Shield size={24} className="text-indigo-400" /> 2. Comprendre les Statuts (Pastilles de couleur)
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Sur la page "Membres & Accès", chaque membre a une pastille de couleur. Elle vous indique immédiatement si ce client reçoit vos trades ou non.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <h4 className="font-bold text-emerald-400 mb-2 text-lg">Actif</h4>
            <p className="text-slate-300 text-sm leading-relaxed">Le système tourne pour lui. Soit il paie son abonnement Stripe régulièrement, soit vous lui avez donné un accès VIP manuel. Ses trades sont copiés H24.</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <XCircle size={24} className="text-rose-400" />
            </div>
            <h4 className="font-bold text-rose-400 mb-2 text-lg">Inactif / Expiré</h4>
            <p className="text-slate-300 text-sm leading-relaxed">L'abonnement du client s'est terminé, ou sa carte bancaire a été refusée par Stripe. BleuApp a automatiquement bloqué la copie de ses futurs trades.</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <AlertTriangle size={24} className="text-amber-400" />
            </div>
            <h4 className="font-bold text-amber-400 mb-2 text-lg">Suspendu</h4>
            <p className="text-slate-300 text-sm leading-relaxed">Le compte est pénalisé. Vous avez cliqué manuellement sur le bouton pour stopper son service. Il ne recevra plus rien tant que vous ne cliquerez pas sur "Réactiver".</p>
          </div>
        </div>
      </div>

      {/* Section: Actions */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Edit size={24} className="text-blue-400" /> 3. Actions que vous pouvez faire
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Dans le tableau des clients, passez votre souris sur un client. À droite de la ligne, trois petites icônes invisibles apparaîtront :
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Coche Verte (Activer/Désactiver l'accès)</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">C'est le bouton magique "On/Off". Cliquez dessus pour passer un client en "Actif", et recliquez pour le passer en "Suspendu". Super pratique pour bannir quelqu'un sans effacer son compte.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Edit size={24} className="text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Crayon Bleu (Modifier le client)</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">Si le client a oublié son mot de passe, ou veut changer d'adresse email, vous pouvez le faire ici. Attention, s'il se connectait via Google, modifier le mot de passe ne marchera pas (c'est Google qui gère).</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 size={24} className="text-rose-400" />
            </div>
            <div>
              <h4 className="font-bold text-rose-400 text-base">Poubelle Rouge (Supprimer définitivement)</h4>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">⚠️ <strong className="text-rose-400">Action dangereuse.</strong> Ne cliquez ici que si vous êtes sûr. Le compte est détruit de la base de données, la copie de ses abonnements Stripe, et de ses connexions MetaTrader. Irréversible.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 border-t border-white/10 pt-8">
        <Link href="/admin/aide" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
          <ChevronLeft size={16} /> Centre d&apos;Aide
        </Link>
        <Link href="/admin/aide/signaux" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl transition-colors flex items-center gap-2">
          Suivant : Configurer les Signaux <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
