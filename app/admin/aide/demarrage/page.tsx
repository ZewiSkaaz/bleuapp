'use client'

import Link from 'next/link'
import { 
  Rocket, ChevronLeft, CheckCircle, ArrowRight, 
  Database as DatabaseIcon, CreditCard, Zap, Shield, Terminal,
  ExternalLink, Copy, AlertTriangle, HelpCircle
} from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Étape 1 : Votre Base de données (Supabase)',
    icon: DatabaseIcon,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    content: [
      { type: 'text', value: "Bienvenue ! Pour démarrer, BleuApp a besoin d'un 'cerveau' pour se souvenir de vos clients, de leurs abonnements et des signaux de trading. C'est le rôle de Supabase." },
      { type: 'heading', value: "Qu'est-ce que Supabase ?" },
      { type: 'text', value: "Supabase est un service en ligne gratuit qui héberge votre base de données en toute sécurité. C'est là que toutes les informations vitales de votre entreprise sont stockées." },
      { type: 'heading', value: 'Comment faire, pas à pas :' },
      { type: 'step', value: "1. Allez sur supabase.com et créez un compte gratuit." },
      { type: 'step', value: "2. Cliquez sur 'New Project' (Nouveau projet), donnez-lui le nom de votre entreprise et générez un mot de passe sécurisé (gardez-le précieusement)." },
      { type: 'step', value: "3. Une fois le projet créé (cela prend quelques minutes), allez dans les paramètres (Settings > API) dans le menu de gauche." },
      { type: 'step', value: "4. Copiez l'URL de votre projet (SUPABASE_URL) et votre clé publique (SUPABASE_ANON_KEY)." },
      { type: 'step', value: "5. Dans ce même menu, trouvez et copiez précieusement la clé 'service_role' (SUPABASE_SERVICE_ROLE_KEY). C'est la clé maître de votre système." },
      { type: 'step', value: "6. Enfin, allez dans le 'SQL Editor' sur Supabase et collez le script d'initialisation que nous vous avons fourni pour créer les tables." },
      { type: 'warning', value: "Sécurité : Ne donnez JAMAIS votre clé 'service_role' à vos clients. Elle donne un contrôle total sur votre base de données !" },
    ]
  },
  {
    number: 2,
    title: 'Étape 2 : Vos Paiements (Stripe)',
    icon: CreditCard,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    content: [
      { type: 'text', value: "Maintenant que votre système a une mémoire, il faut lui permettre d'encaisser l'argent de vos abonnés automatiquement." },
      { type: 'heading', value: "Qu'est-ce que Stripe ?" },
      { type: 'text', value: "Stripe est la plateforme de paiement la plus sécurisée au monde. Elle va gérer les cartes bancaires de vos clients, prélever les abonnements tous les mois, et envoyer l'argent sur votre compte bancaire." },
      { type: 'heading', value: 'Comment faire, pas à pas :' },
      { type: 'step', value: "1. Créez un compte sur stripe.com et remplissez les informations de votre entreprise." },
      { type: 'step', value: "2. Dans l'onglet 'Catalogue de produits' (Products), créez un nouveau produit : 'Abonnement BleuApp'." },
      { type: 'step', value: "3. Créez deux prix pour ce produit : un prix Récurrent Mensuel, et un prix Récurrent Annuel." },
      { type: 'step', value: "4. Regardez les détails de ces prix : vous verrez un identifiant caché commençant par 'price_' (ex: price_1N4b...). Notez ces deux identifiants." },
      { type: 'step', value: "5. Allez dans l'onglet Développeurs > Webhooks. Ajoutez un endpoint pointant vers : https://votre-site.com/api/webhooks/stripe" },
      { type: 'step', value: "6. Cochez les événements suivants pour que le site sache quand un client paie : checkout.session.completed, customer.subscription.updated, customer.subscription.deleted." },
      { type: 'info', value: "Astuce : En mode test, Stripe vous permet d'utiliser la fausse carte 4242 4242 4242 4242 pour faire des essais sans payer." },
    ]
  },
  {
    number: 3,
    title: 'Étape 3 : Le Cerveau des Signaux (Telegram)',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    content: [
      { type: 'text', value: "Votre plateforme a besoin de lire les alertes de trading pour les envoyer à vos clients. Telegram sera votre source." },
      { type: 'heading', value: "Comment ça marche ?" },
      { type: 'text', value: "Nous allons créer un 'Bot' Telegram. Ce bot robot lira en silence l'un de vos canaux Telegram VIP, attrapera les signaux (ex: ACHAT EURUSD), et les transmettra instantanément à BleuApp." },
      { type: 'heading', value: 'Comment faire, pas à pas :' },
      { type: 'step', value: "1. Ouvrez l'application Telegram sur votre téléphone ou PC." },
      { type: 'step', value: "2. Cherchez l'utilisateur officiel nommé '@BotFather' et envoyez-lui un message." },
      { type: 'step', value: "3. Tapez /newbot pour créer un nouveau robot. Suivez les instructions pour lui donner un nom." },
      { type: 'step', value: "4. À la fin, BotFather vous donnera un grand message contenant le Token de votre bot (ex: 123456:ABCdefGhIjKlm...). Copiez ce token." },
      { type: 'step', value: "5. Ajoutez ce robot en tant qu'Administrateur dans le canal Telegram où vous postez vos signaux." },
      { type: 'step', value: "6. Dans ce Dashboard (rubrique Signal Bridge), entrez le Chat ID de votre canal Telegram pour que le bot sache où écouter." },
      { type: 'info', value: "Astuce : Comment trouver le 'Chat ID' de mon canal ? Ajoutez simplement un autre bot appelé '@userinfobot' ou transférez un de vos messages à '@getidsbot'." },
    ]
  },
  {
    number: 4,
    title: 'Étape 4 : Copier les Trades (MetaAPI)',
    icon: Shield,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    content: [
      { type: 'text', value: "Le signal a été lu par le bot. Il faut maintenant l'exécuter VRAIMENT sur le compte de trading de votre client." },
      { type: 'heading', value: "Qu'est-ce que MetaAPI ?" },
      { type: 'text', value: "MetaAPI est le pont sécurisé entre votre plateforme et les logiciels MetaTrader 4 / MetaTrader 5 des brokers (courtiers)." },
      { type: 'heading', value: 'Comment faire, pas à pas :' },
      { type: 'step', value: "1. Allez sur metaapi.cloud et créez un compte gratuit." },
      { type: 'step', value: "2. Dans leur dashboard, générez un 'API Token' (Jeton d'API). C'est ce qui permet à BleuApp de se connecter à eux." },
      { type: 'step', value: "3. Côté client : vos utilisateurs s'inscriront sur votre site BleuApp et entreront eux-mêmes les identifiants de leur compte de trading (Numéro de compte, Mot de passe, et Nom du broker)." },
      { type: 'info', value: "Note Importante : Rien n'est prélevé directement sur le compte de trading du client. BleuApp n'a pas accès à leurs fonds bancaires chez le broker, seulement au droit de passer des ordres (Achat/Vente)." },
      { type: 'warning', value: "Attention : Les clients DOIVENT fournir leur mot de passe 'Trader' (mot de passe principal) de MetaTrader, et non pas le mot de passe 'Investisseur' (qui ne permet que la lecture de l'écran)." },
    ]
  },
  {
    number: 5,
    title: 'Étape 5 : Lancer la Machine (Moteur Actif !)',
    icon: Terminal,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    content: [
      { type: 'text', value: "Tout est branché ! Base de données, Paiements, Source Telegram et Pont MetaTrader. Il est temps d'allumer le moteur." },
      { type: 'heading', value: "Le flux final automatique :" },
      { type: 'text', value: "Voici exactement ce qui va se passer une fois en ligne :" },
      { type: 'step', value: "1. Vous (ou votre trader) écrivez un message sur votre canal Telegram : 'ACHAT GOLD STOP LOSS 2000 TAKE PROFIT 2050'." },
      { type: 'step', value: "2. Moins d'une seconde plus tard, le bot BleuApp lit le message et comprend les valeurs exactes." },
      { type: 'step', value: "3. BleuApp vérifie instantanément qui sont vos clients ayant un abonnement Stripe à jour." },
      { type: 'step', value: "4. BleuApp envoie l'ordre à MetaAPI pour chaque client actif." },
      { type: 'step', value: "5. L'application MetaTrader 5 de chaque client place l'ordre Achat sur l'Or à la fraction de seconde." },
      { type: 'info', value: "Vous pourrez surveiller tout ce processus en direct comme un hacker dans l'onglet 'Logs & Terminaux' de ce Dashboard !" },
    ]
  },
]

export default function DemarragePage() {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
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
            <h2 className="text-3xl font-extrabold text-white">Guide Complet du Débutant</h2>
            <p className="text-emerald-400 text-sm font-semibold mt-1">Comprenez et configurez votre plateforme en 5 étapes</p>
          </div>
        </div>
      </div>
      
      {/* Intro Box */}
      <div className="glass-panel p-6 bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
        <HelpCircle size={24} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold mb-2">Lisez ceci avant de commencer</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Créer un SaaS de Copy Trading peut sembler technique, mais c'est comme assembler des legos. 
            Vous avez 4 pièces distinctes à lier ensemble : la **Base de données** (votre cerveau), **Stripe** (votre caissier), **Telegram** (vos yeux) et **MetaAPI** (vos bras).
            Prenez 15 minutes pour lire attentivement chaque étape de haut en bas sans vous précipiter.
          </p>
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
                <div className={`w-12 h-12 rounded-2xl ${step.bgColor} flex items-center justify-center flex-shrink-0 border border-white/10 shadow-lg`}>
                  <span className={`text-xl font-black ${step.color}`}>{step.number}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <Icon size={24} className={step.color} />
                    {step.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {step.content.map((item, i) => {
                      if (item.type === 'text') {
                        return <p key={i} className="text-slate-300 text-sm leading-relaxed">{item.value}</p>
                      }
                      if (item.type === 'heading') {
                        return <h4 key={i} className="text-base font-bold text-white mt-6 mb-2">{item.value}</h4>
                      }
                      if (item.type === 'step') {
                        return (
                          <div key={i} className="flex items-start gap-3 text-sm text-slate-300 bg-[#0f172a]/50 p-3 rounded-lg border border-white/5">
                            <CheckCircle size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{item.value}</span>
                          </div>
                        )
                      }
                      if (item.type === 'warning') {
                        return (
                          <div key={i} className="bg-red-500/10 border border-red-500/30 text-rose-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 mt-4 shadow-lg shadow-red-500/5">
                            <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{item.value}</span>
                          </div>
                        )
                      }
                      if (item.type === 'info') {
                        return (
                          <div key={i} className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 mt-4 shadow-lg shadow-blue-500/5">
                            <Zap size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{item.value}</span>
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
      <div className="glass-panel p-8 text-center border-t-4 border-t-blue-500 mt-12 bg-gradient-to-b from-blue-900/10 to-transparent">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <CheckCircle size={32} className="text-blue-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Félicitations, vous avez tout compris.</h3>
        <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
          La théorie est acquise. Votre plateforme BleuApp est le chef d'orchestre de tous ces outils.
          Voulez-vous voir comment gérer vos premiers clients concrètement ?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admin/aide/clients" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
            Apprendre à gérer ses Clients <ArrowRight size={18} />
          </Link>
          <Link href="/admin/dashboard" className="bg-[#1e293b] hover:bg-slate-700 border border-white/10 text-white font-semibold py-3 px-8 rounded-xl transition-colors flex items-center justify-center">
            Aller au Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
