import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Activity, Server } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const { data: mt5Accounts } = await supabase
    .from("mt5_accounts")
    .select(
      "id, account_number, broker_name, server_name, is_active, metaapi_account_id"
    )
    .eq("user_id", session.user.id)
    .eq("is_active", true);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  // Récupérer les trades des deux sources (copy trading classique et signaux Telegram)
  const [copyTradesResult, telegramTradesResult] = await Promise.all([
    supabase
      .from("copy_trades")
      .select("*")
      .eq("follower_user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("telegram_trades")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20)
  ]);

  const copyTradesRaw = copyTradesResult.data || [];
  const telegramTradesRaw = telegramTradesResult.data || [];

  // Normaliser et fusionner les trades
  const copyTrades = [
    ...copyTradesRaw.map((t: any) => ({
      ...t,
      source: 'copy',
      entry_price: t.open_price,
      exit_price: t.close_price,
      entry_time: t.opened_at || t.created_at,
      exit_time: t.closed_at,
      display_status: t.status === 'opened' ? 'OUVERT' : t.status === 'closed' ? 'FERMÉ' : t.status === 'failed' ? 'ÉCHEC' : t.status.toUpperCase()
    })),
    ...telegramTradesRaw.map((t: any) => ({
      ...t,
      source: 'telegram',
      entry_price: t.entry_price,
      exit_price: t.close_price || null,
      entry_time: t.executed_at || t.created_at,
      exit_time: t.closed_at || null,
      // Harmonisation des champs pour l'affichage
      order_type: `${t.signal_type} ${t.order_type || 'MARKET'}`,
      display_status: t.status === 'executed' ? 'OUVERT' : t.status === 'closed' ? 'FERMÉ' : t.status === 'failed' ? 'ÉCHEC' : 'EN ATTENTE'
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20 animate-fade-in">
      <Navbar isAdmin={profile?.is_admin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
            Bienvenue, {profile?.full_name || "Trader"} 👋
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">
            Supervisez vos comptes de trading et l'activité de vos copies en temps réel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl bg-[#1e293b]/80 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Abonnement
            </h3>
            <p className="text-3xl font-black mt-3">
              {subscription?.status === "active" ? (
                <span className="text-emerald-500 flex items-center gap-2">✓ Actif</span>
              ) : subscription?.status === "trialing" ? (
                <span className="text-blue-500 flex items-center gap-2">⏱ Essai</span>
              ) : (
                <span className="text-rose-500 flex items-center gap-2">✗ Inactif</span>
              )}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl bg-[#1e293b]/80 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Comptes MT5 Actifs
            </h3>
            <p className="text-3xl font-black mt-3 text-blue-400">
              {mt5Accounts?.length || 0}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl bg-[#1e293b]/80 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Trades Copiés
            </h3>
            <p className="text-3xl font-black mt-3 text-indigo-400">
              {copyTrades?.length || 0}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Section Comptes MT5 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl bg-[#1e293b]/80 backdrop-blur-md">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Server className="text-blue-500" size={24} /> Comptes MT5
              </h2>
              <Link href="/mt5-accounts" className="btn btn-primary text-sm shadow-lg shadow-blue-500/20 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors">
                Gérer
              </Link>
            </div>

            {mt5Accounts && mt5Accounts.length > 0 ? (
              <div className="space-y-4">
                {mt5Accounts.map((account: any) => (
                  <div
                    key={account.id}
                    className="bg-[#0f172a] rounded-2xl border border-white/10 p-5 relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-blue-400 mb-1">
                          {account.broker_name || "Broker Inconnu"}
                        </p>
                        <div className="bg-white/5 inline-block px-3 py-1 rounded-md mb-3">
                          <p className="text-sm font-mono text-white">
                            #{account.account_number}
                          </p>
                        </div>
                        {account.server_name && (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="opacity-70">Serveur:</span> 
                            <span className="text-slate-300 font-medium">{account.server_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#0f172a] rounded-2xl border border-dashed border-slate-700">
                <p className="font-semibold text-slate-400 mb-4">Aucun compte MT5 connecté</p>
                <Link href="/mt5-accounts" className="inline-flex py-2 px-6 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors shadow-lg">
                  + Lier un compte
                </Link>
              </div>
            )}
          </div>

          {/* Section Derniers Trades */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl bg-[#1e293b]/80 backdrop-blur-md">
            <h2 className="text-2xl font-black text-white mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
              <Activity className="text-indigo-500" size={24} /> Derniers Trades
            </h2>

            {copyTrades && copyTrades.length > 0 ? (
              <div className="space-y-4">
                {copyTrades.slice(0, 5).map((trade: any) => (
                    <div
                      key={trade.id}
                      className="bg-[#0f172a] rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-all shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold text-xl text-white tracking-tight">
                            {trade.symbol}
                          </p>
                          <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-wider">
                            {trade.order_type} • {trade.volume} lots
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            trade.display_status === "OUVERT"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : trade.display_status === "FERMÉ"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : trade.display_status === "ÉCHEC"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                          }`}
                        >
                          {trade.display_status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Entrée</p>
                          <p className="font-mono text-sm text-slate-300">
                            {trade.entry_price ? trade.entry_price.toFixed(5) : '-'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {trade.entry_time ? new Date(trade.entry_time).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sortie</p>
                          <p className="font-mono text-sm text-slate-300">
                            {trade.exit_price ? trade.exit_price.toFixed(5) : '-'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {trade.exit_time ? new Date(trade.exit_time).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#0f172a] rounded-2xl border border-dashed border-slate-700">
                <p className="font-semibold text-slate-400 mb-2">Aucun trade pour le moment</p>
                <p className="text-sm text-slate-500">
                  L'historique des positions apparaîtra ici une fois que le premier trade aura été initié.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
