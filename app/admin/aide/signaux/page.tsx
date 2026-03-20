'use client'

import Link from 'next/link'
import { 
  ChevronLeft, Zap, ArrowRight, AlertTriangle,
  MessageSquare, Radio, Shield, Eye, Wifi, HelpCircle,
  Send, OctagonAlert
} from 'lucide-react'

export default function SignauxGuidePage() {
  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <Link href="/admin/aide" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ChevronLeft size={16} /> Retour au Centre d&apos;Aide
      </Link>

      <div className="glass-panel p-8 border-l-4 border-l-indigo-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Zap size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-white">Dompter Telegram</h2>
            <p className="text-indigo-400 text-sm font-semibold mt-1">Signaux automatiques, manuels et clôture d&apos;urgence</p>
          </div>
        </div>
      </div>

      {/* Intro Box */}
      <div className="glass-panel p-6 bg-blue-500/5 border border-blue-500/20 flex items-start gap-4">
        <HelpCircle size={24} className="text-blue-400 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold mb-2">Comprendre la magie en coulisses</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Imaginez que BleuApp a placé un &quot;espion invisible&quot; (votre bot Telegram) à l&apos;intérieur de votre canal VIP. 
            Dès que vous (ou quelqu&apos;un d&apos;autre) envoyez un message dans ce groupe, l&apos;espion le lit dans la milliseconde. 
            Si ce message ressemble à un signal de trading (ACHAT, VENTE, SL, TP), il l&apos;attrape et l&apos;envoie à la machinerie de BleuApp.
          </p>
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Radio size={24} className="text-blue-400" /> 1. Le chemin d&apos;un signal
        </h3>
        
        <div className="bg-[#0f172a]/80 rounded-2xl p-6 border border-white/5 mb-8 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <MessageSquare size={28} className="text-indigo-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">1. Canal Telegram</div>
                <div className="text-xs text-slate-400 mt-1">Vous postez un message</div>
              </div>
            </div>

            <ArrowRight size={24} className="text-slate-600 rotate-90 md:rotate-0" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Zap size={28} className="text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">2. Le Bot Filtre</div>
                <div className="text-xs text-slate-400 mt-1">Il extrait les prix et stop-loss</div>
              </div>
            </div>

            <ArrowRight size={24} className="text-slate-600 rotate-90 md:rotate-0" />
            
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Shield size={28} className="text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">3. MetaTrader 5</div>
                <div className="text-xs text-slate-400 mt-1">Le trade est pris chez les clients</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Ajouter un canal */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Wifi size={24} className="text-emerald-400" /> 2. Ajouter un Canal (Détails pour débutants)
        </h3>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          Pour que le robot espion sache <strong>quel</strong> groupe écouter, vous devez l&apos;ajouter au Dashboard.
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold">1</div>
            <div>
              <h4 className="font-bold text-white text-base">Nom du canal</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">Mettez ce que vous voulez (ex: &quot;VIP Gold&quot;, &quot;Signaux Gratuits&quot;). Ce nom n&apos;est que pour vous aider à vous y retrouver dans l&apos;interface, le robot s&apos;en moque.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold">2</div>
            <div>
              <h4 className="font-bold text-white text-base">Le fameux &quot;Chat ID&quot;</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">C&apos;est le code secret mathématique de votre groupe Telegram. Il commence TRES SOUVENT par <strong>-100</strong> (exemple : -1004928347). S&apos;il manque le tirait ou le 100, le bot ne trouvera jamais la cible.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5 hover:bg-[#1e293b]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold">3</div>
            <div>
              <h4 className="font-bold text-white text-base">Préfixe / Mots Clés</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">Le bot est bête. Si vous dites &quot;Hello les gars, voici l&apos;analyse sur l&apos;or&quot;, il va essayer de le trader et paniquer. Si vous définissez le mot &quot;SIGNAL&quot;, le bot ignorera tout message ne contenant pas le mot &quot;SIGNAL&quot;.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 text-rose-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 shadow-lg shadow-red-500/5">
          <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-red-400" />
          <div className="leading-relaxed">
            <strong className="text-red-400 font-bold">L&apos;erreur numéro 1 des débutants :</strong> <br/>
            Si vous ajoutez le canal ici, mais que le bot Telegram (celui créé avec BotFather) n&apos;est pas <strong>Administrateur</strong> dans votre groupe sur l&apos;application Telegram, Telegram refusera de lui donner les messages. Le bot doit avoir la couronne d&apos;admin.
          </div>
        </div>
      </div>

      {/* Monitoring */}
      <div className="glass-panel p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Eye size={24} className="text-blue-400" /> 3. Comment vérifier que ça marche ? (La page Logs)
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Une fois tout paramétré, envoyez un faux signal dans votre groupe Telegram. Puis allez dans la page <strong className="text-white">Logs &amp; Terminaux</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-emerald-400 bg-emerald-400/10 p-2 rounded-lg">✅</span>
              <h4 className="font-bold text-white">Ce que vous devez voir :</h4>
            </div>
            <p className="text-slate-400 text-sm font-mono leading-relaxed break-all">
              [SIGNAL_IN] BUY EURUSD | SL: 1.050 | TP: 1.080
            </p>
            <p className="text-slate-500 text-xs mt-3">Bingo, le bot a parfaitement lu, attrapé et découpé votre texte.</p>
          </div>

          <div className="bg-[#0f172a]/80 p-5 rounded-xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-amber-400 bg-amber-400/10 p-2 rounded-lg">❓</span>
              <h4 className="font-bold text-white">S&apos;il n&apos;y a rien :</h4>
            </div>
            <ul className="text-slate-400 text-sm leading-relaxed list-disc ml-4 space-y-1">
              <li>Le Chat ID est faux (manque le -100).</li>
              <li>Le bot n&apos;est pas admin du groupe.</li>
              <li>Le Webhook a bugué (Cliquez sur &quot;Resync&quot; dans le terminal).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 4 - Signal Manuel */}
      <div className="glass-panel p-6 border border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Send size={24} className="text-blue-400" /> 4. Envoyer un Signal Manuel (Votre Filet de Sécurité)
        </h3>
        
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            <strong className="text-blue-400">À quoi ça sert ?</strong> Parfois, le bot Telegram rate un signal. Soit le message était mal formaté, soit le Webhook a eu un bug. 
            Dans ce cas, <strong className="text-white">vous pouvez envoyer le signal vous-même</strong> directement depuis le Dashboard, sans passer par Telegram. 
            C&apos;est comme être le pilote de secours quand l&apos;autopilote tombe en panne.
          </p>
        </div>

        <h4 className="text-white font-bold mb-4">Comment faire ?</h4>
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">1</div>
            <div>
              <h4 className="font-bold text-white text-base">Ouvrez la page Logs &amp; Terminaux</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">Dans le menu latéral, cliquez sur <strong className="text-white">Logs &amp; Terminal</strong>. Vous verrez le terminal Telegram à droite.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">2</div>
            <div>
              <h4 className="font-bold text-white text-base">Cliquez sur le bouton bleu &quot;Signal Manuel&quot;</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Il se trouve en haut du terminal Telegram. Un formulaire apparaît en superposition.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">3</div>
            <div>
              <h4 className="font-bold text-white text-base">Remplissez les champs</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">Voici ce que chaque champ veut dire :</p>
              <ul className="text-slate-400 text-sm mt-3 space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold min-w-[100px]">Symbole :</span> L&apos;actif à trader (ex: GOLD, EURUSD, BTC, US30).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold min-w-[100px]">Action :</span> BUY (acheter) ou SELL (vendre).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold min-w-[100px]">Type d&apos;Ordre :</span> MARKET = exécution immédiate au prix actuel. LIMIT = on attend un prix précis.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold min-w-[100px]">Stop Loss :</span> Le prix auquel on coupe les pertes si le marché va contre nous. <strong className="text-white">Toujours le mettre !</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold min-w-[100px]">Take Profit :</span> Le prix auquel on encaisse les gains. Optionnel mais recommandé.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold min-w-[100px]">Canal :</span> Choisissez le canal dont les abonnés recevront ce trade.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold">4</div>
            <div>
              <h4 className="font-bold text-white text-base">Cliquez &quot;Diffuser le Signal&quot;</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Le signal est immédiatement enregistré et envoyé à tous les comptes MT5 des clients abonnés. 
                Vous verrez un message vert dans le terminal confirmant l&apos;envoi.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3">
          <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-amber-400" />
          <div className="leading-relaxed">
            <strong className="text-amber-400 font-bold">Attention :</strong> Un signal manuel suit <strong>exactement</strong> le même chemin qu&apos;un signal Telegram automatique. 
            Il sera envoyé à <strong>tous les abonnés</strong> du canal sélectionné. Vérifiez bien vos valeurs avant de cliquer !
          </div>
        </div>
      </div>

      {/* Section 5 - Clôture d'Urgence */}
      <div className="glass-panel p-6 border border-rose-500/20">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <OctagonAlert size={24} className="text-rose-400" /> 5. Clôture d&apos;Urgence (Le Bouton Panique)
        </h3>
        
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            <strong className="text-rose-400">À quoi ça sert ?</strong> Imaginez : une annonce économique inattendue fait plonger le marché de 200 pips en 30 secondes. 
            Vous n&apos;avez pas le temps de fermer chaque trade de chaque client un par un. 
            Le bouton <strong className="text-white">GLOBAL CLOSE</strong> ferme <strong>toutes les positions ouvertes</strong> sur <strong>tous les comptes MT5</strong> de vos clients en un seul clic.
          </p>
        </div>

        <h4 className="text-white font-bold mb-4">Comment ça fonctionne ?</h4>
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-400 font-bold">1</div>
            <div>
              <h4 className="font-bold text-white text-base">Trouvez la zone rouge en bas du terminal</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                En bas du terminal Telegram, il y a une zone rouge intitulée <strong className="text-rose-400">&quot;Zone d&apos;Intervention d&apos;Urgence&quot;</strong>. 
                C&apos;est votre centre de commande d&apos;urgence.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-400 font-bold">2</div>
            <div>
              <h4 className="font-bold text-white text-base">Cliquez sur &quot;GLOBAL CLOSE&quot;</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Une alerte de confirmation apparaîtra. Si vous confirmez, BleuApp envoie un ordre de fermeture à <strong>chaque compte MT5 actif</strong> via MetaAPI.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-[#0f172a]/50 rounded-xl border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-400 font-bold">3</div>
            <div>
              <h4 className="font-bold text-white text-base">Vérifiez le résultat dans les logs</h4>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Le terminal affichera le nombre de positions fermées. Exemple : <span className="font-mono text-emerald-400">&quot;5 position(s) fermée(s) avec succès&quot;</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 text-rose-300 px-5 py-4 rounded-xl text-sm flex items-start gap-3 shadow-lg shadow-red-500/5">
          <AlertTriangle size={24} className="mt-0.5 flex-shrink-0 text-red-400" />
          <div className="leading-relaxed">
            <strong className="text-red-400 font-bold">⚠️ ACTION IRRÉVERSIBLE :</strong> <br/>
            Une fois les positions fermées, c&apos;est définitif. Le trade est coupé au prix du marché à cet instant précis. 
            Utilisez ce bouton <strong>uniquement en cas d&apos;urgence réelle</strong> (crash, annonce inattendue, erreur de signal).
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 border-t border-white/10 pt-8">
        <Link href="/admin/aide/clients" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">
          <ChevronLeft size={16} /> Gestion des Clients
        </Link>
        <Link href="/admin/aide/trading" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl transition-colors flex items-center gap-2">
          Suivant : Copie vers MetaTrader <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
