'use client'

import Link from 'next/link'
import { 
  ChevronLeft, CreditCard, CheckCircle, ArrowRight, AlertTriangle,
  Zap, RefreshCw, DollarSign, Clock, XCircle
} from 'lucide-react'

export default function FacturationGuidePage() {
  return (
    <div className="animate-fade-in space-y-8">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-violet-500">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <CreditCard size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Facturation & Stripe</h2>
            <p className="text-violet-400 text-sm font-semibold mt-1">Paiements, abonnements et webhooks</p>
          </div>
        </div>
      </div>

      {/* Flux de paiement */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-emerald-400" /> Flux de Paiement
        </h3>
        <div className="bg-[#0f172a]/50 rounded-xl p-5 border border-white/5 mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center">
            <div className="glass-panel px-4 py-3 text-sm font-bold text-blue-400 flex-1">👤 Client<br/><span className="text-xs text-slate-400 font-normal">Clique sur &quot;S&apos;abonner&quot;</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-violet-400 flex-1">💳 Stripe Checkout<br/><span className="text-xs text-slate-400 font-normal">Paiement sécurisé</span></div>
            <ArrowRight size={20} className="text-slate-500 rotate-90 md:rotate-0" />
            <div className="glass-panel px-4 py-3 text-sm font-bold text-emerald-400 flex-1">✅ Webhook<br/><span className="text-xs text-slate-400 font-normal">Active l&apos;abonnement</span></div>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Le client est redirigé vers Stripe Checkout. Une fois le paiement effectué, 
          Stripe envoie un webhook à BleuApp qui active automatiquement l&apos;abonnement et donne accès aux signaux.
        </p>
      </div>

      {/* Plans */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-400" /> Plans d&apos;Abonnement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
            <h4 className="font-bold text-blue-400 text-lg mb-2">📅 Plan Mensuel</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Renouvellement automatique chaque mois. Le client peut annuler à tout moment.
            </p>
            <div className="text-xs text-slate-500 font-mono bg-[#0f172a] px-3 py-2 rounded-lg border border-white/5">
              Variable Render : STRIPE_PRICE_MONTHLY
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5">
            <h4 className="font-bold text-indigo-400 text-lg mb-2">📆 Plan Annuel</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Facturé une fois par an. Généralement avec une réduction pour inciter l&apos;engagement long terme.
            </p>
            <div className="text-xs text-slate-500 font-mono bg-[#0f172a] px-3 py-2 rounded-lg border border-white/5">
              Variable Render : STRIPE_PRICE_YEARLY
            </div>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <Zap size={16} className="mt-0.5 flex-shrink-0" />
          <span>Pour changer les tarifs, modifiez directement les <strong>prix dans le Stripe Dashboard</strong>. Créez un nouveau prix et mettez à jour la variable d&apos;environnement sur Render.</span>
        </div>
      </div>

      {/* Webhooks */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <RefreshCw size={20} className="text-amber-400" /> Webhooks Stripe
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Les webhooks sont le mécanisme par lequel Stripe informe BleuApp des événements de paiement. 
          Voici les événements écoutés :
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-3 text-sm bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
            <code className="text-emerald-400 text-xs font-mono">checkout.session.completed</code>
            <span className="text-slate-400 text-xs">— Nouveau paiement validé</span>
          </div>
          <div className="flex items-center gap-3 text-sm bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <RefreshCw size={16} className="text-blue-400 flex-shrink-0" />
            <code className="text-blue-400 text-xs font-mono">customer.subscription.updated</code>
            <span className="text-slate-400 text-xs">— Abonnement modifié / renouvelé</span>
          </div>
          <div className="flex items-center gap-3 text-sm bg-[#0f172a]/50 px-4 py-3 rounded-xl border border-white/5">
            <XCircle size={16} className="text-rose-400 flex-shrink-0" />
            <code className="text-rose-400 text-xs font-mono">customer.subscription.deleted</code>
            <span className="text-slate-400 text-xs">— Abonnement annulé</span>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>L&apos;URL du webhook doit être <code className="font-mono bg-amber-500/20 px-1 rounded">https://votre-domaine.com/api/webhooks/stripe</code>. Vérifiez que le <strong>STRIPE_WEBHOOK_SECRET</strong> est bien configuré dans Render.</span>
        </div>
      </div>

      <div className="flex justify-between">
        <Link href="/admin/aide/trading" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1">
          <ChevronLeft size={16} /> Copy Trading & MT5
        </Link>
        <Link href="/admin/aide/architecture" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-1">
          Architecture & Infrastructure <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
