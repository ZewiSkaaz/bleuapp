'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Users, UserPlus, XCircle, CheckCircle, 
  Edit, Trash2, Shield, CreditCard, ArrowRight, AlertTriangle, Zap
} from 'lucide-react'

export default function ClientsGuidePage() {
  return (
    <div className="animate-fade-in space-y-8">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Users size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Gestion des Clients</h2>
            <p className="text-emerald-400 text-sm font-semibold mt-1">Tout savoir sur la gestion de vos membres</p>
          </div>
        </div>
      </div>

      {/* Section: Ajouter un client */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <UserPlus size={20} className="text-blue-400" /> Ajouter un Client Manuellement
        </h3>
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">
          Vous pouvez créer un compte client sans que celui-ci passe par Stripe. 
          C&apos;est utile pour offrir un accès gratuit temporaire, tester la plateforme ou gérer des clients VIP.
        </p>
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Allez dans <strong className="text-white">Membres & Accès</strong> dans la sidebar</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Cliquez sur le bouton bleu <strong className="text-white">&quot;Ajouter un client&quot;</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Remplissez le <strong className="text-white">nom, email et mot de passe</strong></span>
          </div>
          <div className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>Le client pourra immédiatement se connecter avec ces identifiants</span>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <Zap size={16} className="mt-0.5 flex-shrink-0" />
          <span>Le client créé manuellement n&apos;a <strong>pas d&apos;abonnement Stripe</strong>. Pour lui donner l&apos;accès complet, utilisez le bouton &quot;Activer&quot; dans ses actions.</span>
        </div>
      </div>

      {/* Section: Statuts */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-indigo-400" /> Comprendre les Statuts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <h4 className="font-bold text-emerald-400 mb-1">Actif</h4>
            <p className="text-slate-400 text-xs">Le client a un abonnement Stripe actif ou a été activé manuellement. Il a accès à tous les signaux et au copy trading.</p>
          </div>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-3">
              <XCircle size={20} className="text-rose-400" />
            </div>
            <h4 className="font-bold text-rose-400 mb-1">Inactif</h4>
            <p className="text-slate-400 text-xs">L&apos;abonnement a expiré, été annulé, ou n&apos;a jamais été créé. Le client ne recevra plus aucun signal.</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={20} className="text-amber-400" />
            </div>
            <h4 className="font-bold text-amber-400 mb-1">Suspendu</h4>
            <p className="text-slate-400 text-xs">L&apos;admin a manuellement suspendu l&apos;accès. Peut être réactivé à tout moment sans passer par Stripe.</p>
          </div>
        </div>
      </div>

      {/* Section: Actions */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Edit size={20} className="text-blue-400" /> Actions Disponibles
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Survolez un client dans la liste pour voir ses actions (elles apparaissent au survol) :
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle size={18} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Activer / Suspendre l&apos;accès</h4>
              <p className="text-slate-400 text-xs mt-1">Bascule l&apos;état de l&apos;abonnement du client. Idéal pour offrir un accès temporaire ou pénaliser un utilisateur sans le supprimer.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Edit size={18} className="text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Modifier le client</h4>
              <p className="text-slate-400 text-xs mt-1">Changez le nom, l&apos;email ou le mot de passe d&apos;un client. Le client sera notifié si son email change.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 size={18} className="text-rose-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Supprimer définitivement</h4>
              <p className="text-slate-400 text-xs mt-1">⚠️ <strong className="text-rose-400">Action irréversible.</strong> Supprime le compte, son abonnement et tous les comptes MT5 associés.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/admin/aide" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Centre d&apos;Aide
        </Link>
        <Link href="/admin/aide/signaux" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-1">
          Configuration des Signaux <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
