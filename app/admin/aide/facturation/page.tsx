'use client'

import Link from 'next/link'
import { 
  ChevronLeft, CreditCard, CheckCircle, ArrowRight, AlertTriangle,
  Zap, RefreshCw, DollarSign, Clock, XCircle, HelpCircle
} from 'lucide-react'

export default function FacturationGuidePage() {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-violet-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <CreditCard size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Facturation & Stripe</h2>
            <p className="text-violet-400 text-sm font-semibold mt-1">Comment votre plateforme gagne de l'argent (tout seul)</p>
          </div>
        </div>
      </div>

      {/* Intro Box */}
      <div className="glass-panel p-6 bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
        <HelpCircle size={24} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold mb-2">L'automatisation des paiements</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            L'un des plus grands avantages de BleuApp est que vous n'avez pas besoin de chasser vos clients pour qu'ils paient.
            Stripe s'occupe de prélever leurs cartes bancaires automatiquement tous les mois (ou tous les ans). Dès que Stripe réussit à prendre l'argent, il envoie un message secret ("Webhook") à BleuApp pour dire : "C'est bon, laisse passer ses trades !".
          </p>
        </div>
      </div>

      {/* Flux de paiement */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <DollarSign size={24} className="text-emerald-400" /> 1. Le parcours d'un client qui paie
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Voici exactement ce qui se passe quand un inconnu visite votre site public et décide de s'abonner.
        </p>
        
        <div className="bg-[#0f172a]/80 rounded-2xl p-6 border border-white/5 mb-6 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-center">
            
            <div className="flex flex-col items-center gap-2 max-w-[150px]">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <span className="text-xl">🧑‍💻</span>
              </div>
              <div className="text-xs text-slate-300">Il clique sur "S'abonner" et crée son compte BleuApp.</div>
            </div>

            <ArrowRight size={20} className="text-slate-600 rotate-90 md:rotate-0 my-2" />
            
            <div className="flex flex-col items-center gap-2 max-w-[150px]">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/10">
                <CreditCard size={20} className="text-violet-400" />
              </div>
              <div className="text-xs text-slate-300">Stripe lui demande sa carte et valide le paiement.</div>
            </div>

            <ArrowRight size={20} className="text-slate-600 rotate-90 md:rotate-0 my-2" />
            
            <div className="flex flex-col items-center gap-2 max-w-[150px]">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Zap size={20} className="text-amber-400" />
              </div>
              <div className="text-xs text-slate-300">Stripe déclenche le Webhook caché vers BleuApp.</div>
            </div>

            <ArrowRight size={20} className="text-slate-600 rotate-90 md:rotate-0 my-2" />
            
            <div className="flex flex-col items-center gap-2 max-w-[150px]">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <CheckCircle size={20} className="text-emerald-400" />
              </div>
              <div className="text-xs text-slate-300">Son compte passe en "Actif". La copie des trades commence.</div>
            </div>

          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock size={24} className="text-blue-400" /> 2. Gérer vos prix (Plans d'Abonnement)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Tous vos tarifs se gèrent <strong>exclusivement sur Stripe</strong> (dans votre tableau de bord Stripe {'->'} Catalogue de Produits). <br/>
          BleuApp a seulement besoin de connaître l'identifiant secret de vos deux forfaits :
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-5 hover:bg-[#1e293b]/50 transition-colors">
            <h4 className="font-bold text-blue-400 text-lg mb-2 flex items-center gap-2">📅 Plan Mensuel</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Ce tarif prélèvera le client tous les mois, à la même date. Copiez l'ID du prix depuis Stripe (il commence par <code className="text-indigo-300">price_</code>) et collez-le dans les variables de votre serveur.
            </p>
            <div className="text-xs text-slate-300 font-mono bg-black/50 px-3 py-2 rounded-lg border border-white/10 break-all">
              Variable : STRIPE_PRICE_MONTHLY
            </div>
          </div>
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-xl p-5 hover:bg-[#1e293b]/50 transition-colors">
            <h4 className="font-bold text-indigo-400 text-lg mb-2 flex items-center gap-2">📆 Plan Annuel</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Ce tarif prélève une liasse d'un coup, valable pour 1 an. Très bien pour la trésorerie. L'ID commence aussi par <code className="text-indigo-300">price_</code>.
            </p>
            <div className="text-xs text-slate-300 font-mono bg-black/50 px-3 py-2 rounded-lg border border-white/10 break-all">
              Variable : STRIPE_PRICE_YEARLY
            </div>
          </div>
        </div>
        
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 shadow-lg shadow-amber-500/5">
          <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <div className="leading-relaxed">
            <strong className="text-amber-500 font-bold">Vous voulez changer vos prix demain ?</strong> <br/>
            Allez sur Stripe, ajoutez un nouveau prix à votre produit existant, et remplacez simplement la variable sur Render (puis redémarrez Render). Vos anciens clients continueront de payer l'ancien prix, les nouveaux paieront le nouveau ! BleuApp gère tout.
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <RefreshCw size={24} className="text-emerald-400" /> 3. La connexion secrète : Les Webhooks
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          "Webhook" est un mot qui fait peur, mais c'est juste un SMS que Stripe envoie à votre site BleuApp pour le tenir au courant.
          Si Stripe ne peut pas envoyer ce SMS, un client peut payer... mais son compte restera "Inactif" sur votre outil parce que BleuApp n'a pas été prévenu !
        </p>

        <h4 className="font-bold text-white mb-3 text-sm">Les 3 SMS (Événements) obligatoires :</h4>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-4 text-sm bg-[#0f172a]/50 p-4 rounded-xl border border-white/5">
            <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
            <div>
              <code className="text-emerald-400 text-xs font-mono mb-1 block">checkout.session.completed</code>
              <span className="text-slate-400 text-xs leading-relaxed">Dit à BleuApp : <em>"Ce client vient de payer sa première facture, active son compte tout de suite !"</em></span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm bg-[#0f172a]/50 p-4 rounded-xl border border-white/5">
            <RefreshCw size={20} className="text-blue-400 flex-shrink-0" />
            <div>
              <code className="text-blue-400 text-xs font-mono mb-1 block">customer.subscription.updated</code>
              <span className="text-slate-400 text-xs leading-relaxed">Dit à BleuApp : <em>"Ce client vient de payer son renouvellement de ce mois-ci, ou a changé de carte, laisse son compte ouvert."</em></span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm bg-[#0f172a]/50 p-4 rounded-xl border border-white/5">
            <XCircle size={20} className="text-rose-400 flex-shrink-0" />
            <div>
              <code className="text-rose-400 text-xs font-mono mb-1 block">customer.subscription.deleted</code>
              <span className="text-slate-400 text-xs leading-relaxed">Dit à BleuApp : <em>"Alerte ! Ce client ne veut plus payer, ou sa carte a expiré de manière définitive. COUPE ses accès tout de suite."</em></span>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 text-rose-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 shadow-lg shadow-red-500/5">
          <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-red-500" />
          <div className="leading-relaxed">
            <strong className="text-red-500 font-bold">Sécurité Stripe :</strong> <br/>
             N'oubliez pas d'ajouter la variable <strong>STRIPE_WEBHOOK_SECRET</strong> sur votre serveur. C'est un mot de passe que Stripe utilise quand il envoie son SMS. Sans ce mot de passe, BleuApp refusera d'écouter Stripe (pour éviter que n'importe quel hackeur vienne activer des comptes gratuits).
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 border-t border-white/10 pt-8">
        <Link href="/admin/aide/trading" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
          <ChevronLeft size={16} /> Copy Trading & MT5
        </Link>
        <Link href="/admin/aide/architecture" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors flex items-center gap-2">
          Architecture & Infrastructure <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
