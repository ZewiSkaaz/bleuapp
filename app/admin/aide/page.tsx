'use client'

import Link from 'next/link'
import { 
  BookOpen, Rocket, Users, Zap, Database, CreditCard, 
  Shield, Terminal, ChevronRight, Sparkles, Target, 
  MessageSquare, Settings, ArrowRight
} from 'lucide-react'

const guides = [
  {
    id: 'demarrage',
    title: 'Guide de Démarrage Rapide',
    description: 'Configurez votre plateforme en 5 étapes simples. De la première connexion à votre premier signal automatique.',
    icon: Rocket,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    steps: ['Configurer Supabase', 'Lier Stripe', 'Connecter Telegram', 'Ajouter un compte MT5', 'Lancer le Copy Trading'],
    href: '/admin/aide/demarrage'
  },
  {
    id: 'clients',
    title: 'Gestion des Clients',
    description: 'Maîtrisez la création, modification et suspension de vos clients. Gérez les accès manuellement ou via Stripe.',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    steps: ['Ajouter un client', 'Activer/Suspendre un accès', 'Comprendre les statuts', 'Gérer les abonnements'],
    href: '/admin/aide/clients'
  },
  {
    id: 'signaux',
    title: 'Configuration des Signaux',
    description: 'Connectez vos canaux Telegram sources, configurez le relais automatique et surveillez les signaux entrants.',
    icon: Zap,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    steps: ['Ajouter un canal source', 'Types de signaux', 'Bot Telegram', 'Monitoring live'],
    href: '/admin/aide/signaux'
  },
  {
    id: 'trading',
    title: 'Comptes MT5 Clients',
    description: 'Gérez les comptes MetaTrader 5 de vos clients où les trades issus des signaux Telegram sont exécutés automatiquement.',
    icon: Database,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    steps: ['Connecter un compte client', 'Configurer MetaAPI', 'Vue admin des comptes', 'Surveillance des positions'],
    href: '/admin/aide/trading'
  },
  {
    id: 'facturation',
    title: 'Facturation & Stripe',
    description: 'Tout savoir sur la gestion des paiements, les plans d\'abonnement et les webhooks Stripe.',
    icon: CreditCard,
    color: 'from-violet-500 to-fuchsia-600',
    bgColor: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
    steps: ['Configurer les produits Stripe', 'Webhooks automatiques', 'Plans mensuels/annuels', 'Gestion des résiliations'],
    href: '/admin/aide/facturation'
  },
  {
    id: 'architecture',
    title: 'Architecture & Infrastructure',
    description: 'Comprenez le fonctionnement technique de BleuApp : Supabase, Render, APIs et sécurité.',
    icon: Settings,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    steps: ['Stack technique', 'Variables d\'environnement', 'Base de données', 'Déploiement Render'],
    href: '/admin/aide/architecture'
  },
]

export default function AideIndexPage() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Hero */}
      <div className="glass-panel p-8 border-l-4 border-l-blue-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white">Centre d&apos;Aide</h2>
              <p className="text-blue-400 text-sm font-semibold">BleuApp Admin Documentation</p>
            </div>
          </div>
          <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
            Bienvenue dans le centre d&apos;aide de votre Control Center. 
            Retrouvez ici tous les guides pour configurer, gérer et optimiser votre plateforme de trading automatisé.
          </p>
        </div>
      </div>

      {/* Quick Start Banner */}
      <Link href="/admin/aide/demarrage" className="block group">
        <div className="glass-panel p-6 border border-emerald-500/30 bg-emerald-900/10 hover:bg-emerald-900/20 transition-all duration-300 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">🚀 Nouveau sur BleuApp ?</h3>
              <p className="text-emerald-400/80 text-sm">Suivez le guide en 5 étapes pour lancer votre plateforme dès maintenant</p>
            </div>
          </div>
          <ArrowRight size={24} className="text-emerald-400 group-hover:translate-x-2 transition-transform" />
        </div>
      </Link>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => {
          const Icon = guide.icon
          return (
            <Link key={guide.id} href={guide.href} className="group">
              <div className="glass-panel p-6 h-full hover:border-white/20 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${guide.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{guide.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{guide.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                  {guide.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className={`w-5 h-5 rounded-full ${guide.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-[10px] font-bold ${guide.iconColor}`}>{i + 1}</span>
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-400 group-hover:text-blue-300">
                  Lire le guide <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* FAQ Quick Section */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-400" /> Questions Fréquentes
        </h3>
        <div className="space-y-3">
          {[
            { q: "Comment ajouter un client sans Stripe ?", a: "Allez dans Membres & Accès → Ajouter un client → Remplissez le formulaire. L'accès sera activé manuellement." },
            { q: "Comment réinitialiser les webhooks ?", a: "Allez dans Logs & Terminal → Cliquez sur 'Resync Webhook'. Le système re-pingera tous vos endpoints." },
            { q: "Comment arrêter le copy trading en urgence ?", a: "Allez dans Paramètres (Copy Trading) → Cliquez sur le bouton rouge 'Arrêter le relais'." },
            { q: "Comment changer les tarifs d'abonnement ?", a: "Modifiez vos prix directement dans le Stripe Dashboard. Les webhooks synchroniseront automatiquement." },
          ].map((faq, i) => (
            <details key={i} className="group bg-[#0f172a]/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-white font-medium text-sm">
                <span>{faq.q}</span>
                <ChevronRight size={16} className="text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
