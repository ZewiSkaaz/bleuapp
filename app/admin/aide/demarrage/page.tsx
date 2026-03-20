'use client'

import Link from 'next/link'
import { 
  Rocket, ChevronLeft, CheckCircle, ArrowRight, 
  Database as DatabaseIcon, CreditCard, Zap, Shield, Terminal,
  ExternalLink, Copy, AlertTriangle
} from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Configurer votre base de données (Supabase)',
    icon: DatabaseIcon,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    content: [
      { type: 'text', value: "Supabase est le cœur de BleuApp. C'est là que sont stockés tous vos utilisateurs, abonnements, comptes MT5 et signaux." },
      { type: 'heading', value: 'Étapes :' },
      { type: 'step', value: "Créez un projet sur supabase.com si ce n'est pas déjà fait" },
      { type: 'step', value: "Récupérez votre SUPABASE_URL et SUPABASE_ANON_KEY depuis Settings → API" },
      { type: 'step', value: "Ajoutez également votre SUPABASE_SERVICE_ROLE_KEY (pour les opérations serveur)" },
      { type: 'step', value: "Exécutez le script SQL d'initialisation dans l'éditeur SQL de Supabase" },
      { type: 'warning', value: "Ne partagez JAMAIS votre SERVICE_ROLE_KEY publiquement. Elle donne un accès total à votre base." },
    ]
  },
  {
    number: 2,
    title: 'Connecter Stripe (Paiements)',
    icon: CreditCard,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    content: [
      { type: 'text', value: "Stripe gère tous les abonnements de vos clients. BleuApp synchronise automatiquement les statuts via webhooks." },
      { type: 'heading', value: 'Configuration :' },
      { type: 'step', value: "Créez un compte sur stripe.com et activez votre Dashboard" },
      { type: 'step', value: "Créez 2 produits : un plan Mensuel et un plan Annuel" },
      { type: 'step', value: "Récupérez les Price IDs (price_xxx) de chaque produit" },
      { type: 'step', value: "Ajoutez-les dans Render : STRIPE_PRICE_MONTHLY et STRIPE_PRICE_YEARLY" },
      { type: 'step', value: "Configurez le webhook Stripe vers : https://votre-domaine.com/api/webhooks/stripe" },
      { type: 'step', value: "Événements à écouter : checkout.session.completed, customer.subscription.updated, customer.subscription.deleted" },
      { type: 'info', value: "En mode test, utilisez la carte 4242 4242 4242 4242 pour simuler des paiements." },
    ]
  },
  {
    number: 3,
    title: 'Connecter le Bot Telegram',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    content: [
      { type: 'text', value: "Le bot Telegram est le relais qui envoie les signaux de trading à vos clients abonnés." },
      { type: 'heading', value: 'Mise en place :' },
      { type: 'step', value: "Créez un bot via @BotFather sur Telegram" },
      { type: 'step', value: "Récupérez le token du bot (ex: 123456:ABCdefGhIjKlmNoPqRsTuVwXyZ)" },
      { type: 'step', value: "Ajoutez le token dans Render : TELEGRAM_BOT_TOKEN" },
      { type: 'step', value: "Ajoutez les canaux sources via l'interface Admin → Canaux Telegram" },
      { type: 'step', value: "Le bot doit être admin dans les canaux sources pour lire les messages" },
      { type: 'info', value: "Utilisez @userinfobot sur Telegram pour trouver les Chat IDs de vos canaux." },
    ]
  },
  {
    number: 4,
    title: 'Configurer MetaAPI (exécution sur MT5)',
    icon: Shield,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    content: [
      { type: 'text', value: "MetaAPI est le service qui connecte les comptes MT5 de vos clients. Quand un signal arrive depuis Telegram, il est exécuté automatiquement sur leurs comptes via MetaAPI." },
      { type: 'heading', value: 'Configuration :' },
      { type: 'step', value: "Créez un compte sur metaapi.cloud et récupérez votre token API" },
      { type: 'step', value: "Ajoutez le token dans Render : META_API_TOKEN" },
      { type: 'step', value: "Vos clients lient leurs comptes MT5 depuis leur espace personnel" },
      { type: 'step', value: "En admin, vous pouvez aussi lier un compte MT5 manuellement pour un client" },
      { type: 'warning', value: "Les clients doivent utiliser leur mot de passe Trader (pas Investor) pour que les trades soient exécutés sur leur compte." },
    ]
  },
  {
    number: 5,
    title: 'Activer le moteur de signaux',
    icon: Terminal,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    content: [
      { type: 'text', value: "Une fois les canaux Telegram configurés et MetaAPI activé, le système est prêt à relayer les signaux vers les comptes MT5 de vos clients." },
      { type: 'heading', value: 'Flux automatique :' },
      { type: 'step', value: "Un signal est publié dans un canal Telegram source" },
      { type: 'step', value: "Le bot BleuApp intercepte et parse le signal (symbole, direction, SL/TP)" },
      { type: 'step', value: "Le signal est exécuté automatiquement sur les comptes MT5 des clients abonnés" },
      { type: 'step', value: "Surveillez les résultats dans Admin → Logs & Terminal" },
      { type: 'info', value: "Vous pouvez activer/désactiver le relais dans Admin → Paramètres à tout moment." },
    ]
  },
]

export default function DemarragePage() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Back Link */}
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      {/* Hero */}
      <div className="glass-panel p-8 border-l-4 border-l-emerald-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Rocket size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Guide de Démarrage Rapide</h2>
            <p className="text-emerald-400 text-sm font-semibold mt-1">5 étapes pour lancer votre plateforme</p>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <div key={step.number} className="glass-panel p-6 relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[2.35rem] top-full h-6 w-0.5 bg-white/10 z-10"></div>
              )}
              
              <div className="flex items-start gap-5">
                {/* Step number */}
                <div className={`w-12 h-12 rounded-2xl ${step.bgColor} flex items-center justify-center flex-shrink-0 border border-white/10`}>
                  <span className={`text-lg font-black ${step.color}`}>{step.number}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Icon size={20} className={step.color} />
                    {step.title}
                  </h3>
                  
                  <div className="space-y-3">
                    {step.content.map((item, i) => {
                      if (item.type === 'text') {
                        return <p key={i} className="text-slate-400 text-sm leading-relaxed">{item.value}</p>
                      }
                      if (item.type === 'heading') {
                        return <h4 key={i} className="text-sm font-bold text-white mt-4 mb-1 uppercase tracking-wider">{item.value}</h4>
                      }
                      if (item.type === 'step') {
                        return (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{item.value}</span>
                          </div>
                        )
                      }
                      if (item.type === 'warning') {
                        return (
                          <div key={i} className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2 mt-2">
                            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                            <span>{item.value}</span>
                          </div>
                        )
                      }
                      if (item.type === 'info') {
                        return (
                          <div key={i} className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-start gap-2 mt-2">
                            <Zap size={16} className="mt-0.5 flex-shrink-0" />
                            <span>{item.value}</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Next Step CTA */}
      <div className="glass-panel p-6 text-center border border-emerald-500/20">
        <h3 className="text-xl font-bold text-white mb-2">✅ Configuration terminée ?</h3>
        <p className="text-slate-400 text-sm mb-4">Votre plateforme est prête à accueillir ses premiers clients !</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/admin/aide/clients" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center gap-2 justify-center">
            Gérer les clients <ArrowRight size={16} />
          </Link>
          <Link href="/admin/dashboard" className="bg-[#1e293b] hover:bg-slate-700 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors inline-flex items-center gap-2 justify-center">
            Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
