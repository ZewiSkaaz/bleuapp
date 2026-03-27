"use client";

import { useEffect, useState, lazy, Suspense, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Server, Activity, AlertCircle, Plus, ChevronDown, RefreshCw, Trash2, Power } from "lucide-react";

type Broker = {
  id: string;
  name: string;
  servers?: string[];
};

type MT5Account = {
  id: string;
  account_number: number;
  is_active: boolean;
  broker_name: string;
  server_name: string;
  metaapi_account_id?: string;
};

type Position = {
  id: string;
  symbol: string;
  type: string;
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  stopLoss?: number;
  takeProfit?: number;
};

export default function MT5AccountsPage() {
  const [mt5Accounts, setMt5Accounts] = useState<MT5Account[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [servers, setServers] = useState<string[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingServers, setLoadingServers] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [manualServerInput, setManualServerInput] = useState(false);

  const [formData, setFormData] = useState({
    broker_name: "",
    server_name: "",
    account_number: "",
    password: "",
    is_investor: false,
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchBrokers();
  }, []);

  const fetchPositions = async (metaapiAccountId: string) => {
    setLoadingPositions(true);
    try {
      const response = await fetch(
        `/api/metaapi/positions?accountId=${metaapiAccountId}`
      );
      const data = await response.json();

      if (data.success && data.positions) {
        setPositions(data.positions);
      }
    } catch (err) {
      console.error("Error fetching positions:", err);
    } finally {
      setLoadingPositions(false);
    }
  };

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();
      
      setProfile(profileData);

      const { data: accountsData } = await supabase
        .from("mt5_accounts")
        .select(
          "id, account_number, is_active, broker_name, server_name, metaapi_account_id"
        )
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (accountsData) {
        const formattedAccounts = accountsData.map((acc: any) => ({
          id: acc.id,
          account_number: acc.account_number,
          is_active: acc.is_active,
          broker_name: acc.broker_name || "N/A",
          server_name: acc.server_name || "N/A",
          metaapi_account_id: acc.metaapi_account_id,
        }));
        setMt5Accounts(formattedAccounts);

        const activeAccount = formattedAccounts.find(
          (acc: any) => acc.is_active && acc.metaapi_account_id
        );
        if (activeAccount?.metaapi_account_id) {
          fetchPositions(activeAccount.metaapi_account_id);
        }
      }
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchBrokers = async () => {
    try {
      const response = await fetch("/api/metaapi/brokers");
      const data = await response.json();

      if (data.success && data.brokers) {
        setBrokers(data.brokers);
      } else {
        setBrokers(data.brokers || []);
      }
    } catch (err) {
      console.error("Error fetching brokers:", err);
      setError("Impossible de charger les brokers");
    }
  };

  const fetchServers = async (brokerName: string) => {
    setLoadingServers(true);
    try {
      const response = await fetch(
        `/api/metaapi/servers?broker=${encodeURIComponent(brokerName)}`
      );
      const data = await response.json();

      if (data.success && data.servers) {
        setServers(data.servers.map((s: any) => s.name));
      } else {
        const broker = brokers.find((b) => b.name === brokerName);
        setServers(broker?.servers || []);
      }
    } catch (err) {
      console.error("Error fetching servers:", err);
      const broker = brokers.find((b) => b.name === brokerName);
      setServers(broker?.servers || []);
    } finally {
      setLoadingServers(false);
    }
  };

  const handleBrokerChange = (brokerName: string) => {
    setFormData({
      ...formData,
      broker_name: brokerName,
      server_name: "",
    });
    setManualServerInput(false);
    if (brokerName) {
      fetchServers(brokerName);
    } else {
      setServers([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoadingSubmit(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) throw new Error("Non authentifié");

      if (mt5Accounts.length > 0) {
        throw new Error(
          "Vous ne pouvez connecter qu'un seul compte MT5. Supprimez votre compte actuel pour en ajouter un nouveau."
        );
      }

      const metaApiResponse = await fetch("/api/metaapi/connect-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `User - ${formData.broker_name} - ${formData.account_number}`,
          login: formData.account_number,
          password: formData.password,
          server: formData.server_name,
          platform: "mt5",
          magic: 0,
        }),
      });

      const metaApiData = await metaApiResponse.json();

      if (!metaApiData.success) {
        throw new Error(
          metaApiData.error || "Erreur lors de la connexion MetaApi"
        );
      }

      const passwordEncrypted = Buffer.from(formData.password).toString(
        "base64"
      );

      const { error } = await supabase.from("mt5_accounts").insert({
        user_id: session.user.id,
        broker_name: formData.broker_name,
        server_name: formData.server_name,
        account_number: parseInt(formData.account_number),
        password_encrypted: passwordEncrypted,
        is_investor: formData.is_investor,
        is_admin_account: false,
        metaapi_account_id: metaApiData.accountId,
        is_active: true,
      });

      if (error) throw error;

      setShowAddForm(false);
      setFormData({
        broker_name: "",
        server_name: "",
        account_number: "",
        password: "",
        is_investor: false,
      });
      setServers([]);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const toggleAccountStatus = async (
    accountId: string,
    currentStatus: boolean
  ) => {
    const { error } = await supabase
      .from("mt5_accounts")
      .update({ is_active: !currentStatus })
      .eq("id", accountId);

    if (!error) fetchData();
  };

  const deleteAccount = async (accountId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte?")) return;

    const { error } = await supabase
      .from("mt5_accounts")
      .delete()
      .eq("id", accountId);

    if (!error) fetchData();
  };

  const inputClass = "w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 bg-[#0f172a] text-white transition-all outline-none";
  const selectClass = "w-full px-4 py-3 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 bg-[#0f172a] text-white transition-all outline-none appearance-none";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans pb-20 animate-fade-in relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <Navbar isAdmin={profile?.is_admin} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">
              Mon Compte MT5
            </h1>
            <p className="text-slate-400 font-medium">Liez votre broker pour recevoir nos signaux automatisés.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="px-4 py-2 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> 
              Actualiser
            </button>
            {mt5Accounts.length === 0 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {showAddForm ? "Annuler" : <><Plus size={18} /> Connecter</>}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-4 rounded-xl mb-6 flex items-start gap-3 backdrop-blur-md">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {showAddForm && (
          <div className="glass-panel p-6 sm:p-8 mb-8 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Server size={20} className="text-blue-400" /> Ajouter une connexion
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Broker <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.broker_name}
                      onChange={(e) => handleBrokerChange(e.target.value)}
                      className={selectClass}
                      required
                    >
                      <option value="">Sélectionner un broker</option>
                      {brokers.map((broker) => (
                        <option key={broker.id} value={broker.name}>
                          {broker.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {brokers.length > 0
                      ? `${brokers.length} brokers supportés officiellement`
                      : "Chargement des brokers..."}
                  </p>
                </div>

                {formData.broker_name && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-semibold text-slate-300">
                        Serveur MT5 <span className="text-rose-400">*</span>
                      </label>
                      {!loadingServers && servers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setManualServerInput(!manualServerInput)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {manualServerInput
                            ? "Utiliser la liste"
                            : "Saisir manuellement"}
                        </button>
                      )}
                    </div>
                    {loadingServers ? (
                      <div className="w-full px-4 py-3 border border-white/10 rounded-xl bg-[#0f172a] text-slate-500 flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin" /> Chargement...
                      </div>
                    ) : manualServerInput || servers.length === 0 ? (
                      <>
                        <input
                          type="text"
                          value={formData.server_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              server_name: e.target.value,
                            })
                          }
                          className={inputClass}
                          placeholder="Ex: VTMarkets-Live"
                          required
                        />
                        <p className="text-xs text-slate-500 mt-2">
                          Entrez le nom exact du serveur (sensible à la casse)
                        </p>
                      </>
                    ) : (
                      <div className="relative">
                        <select
                          value={formData.server_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              server_name: e.target.value,
                            })
                          }
                          className={selectClass}
                          required
                        >
                          <option value="">Sélectionner un serveur</option>
                          {servers.map((server) => (
                            <option key={server} value={server}>
                              {server}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Numéro de compte <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.account_number}
                    onChange={(e) =>
                      setFormData({ ...formData, account_number: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Login (Ex: 123456)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Mot de passe principal <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={inputClass}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="investor_check"
                  checked={formData.is_investor}
                  onChange={(e) =>
                    setFormData({ ...formData, is_investor: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-slate-600 outline-none bg-[#0f172a] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-[#1e293b]"
                />
                <label htmlFor="investor_check" className="text-sm text-slate-400 leading-tight">
                  <strong className="text-slate-300 block mb-1">Mot de passe Investisseur</strong>
                  Cochez cette case si le mot de passe fourni est en lecture seule (le copy trading sera désactivé).
                </label>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={loadingSubmit || !formData.server_name}
                  className="w-full sm:w-auto py-3 px-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                  {loadingSubmit ? "Connexion en cours..." : "Valider la Connexion"}
                </button>
              </div>
            </form>
          </div>
        )}

        {mt5Accounts.length > 0 ? (
          <div className="space-y-8">
            {mt5Accounts.map((account) => {
              return (
                <div key={account.id} className="glass-panel overflow-hidden border-2 border-primary-500/30">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 bg-white/5 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Server className="text-blue-400" size={20} />
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {account.broker_name}
                        </h3>
                        {account.is_active ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            En direct
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            Suspendu
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                        <p><span className="opacity-70">Serveur:</span> <span className="font-medium text-slate-300">{account.server_name}</span></p>
                        <p><span className="opacity-70">Login:</span> <span className="font-mono text-slate-300 bg-[#0f172a] px-2 py-0.5 rounded">{account.account_number}</span></p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => toggleAccountStatus(account.id, account.is_active)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${
                          account.is_active 
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' 
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        <Power size={14} />
                        {account.is_active ? "Suspendre" : "Activer"}
                      </button>

                      <button
                        onClick={() => deleteAccount(account.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 rounded-lg text-sm font-semibold transition-all"
                      >
                        <Trash2 size={14} />
                        Délier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3 backdrop-blur-sm">
              <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <p className="text-sm font-medium text-blue-200">
                Vous ne pouvez connecter qu'un seul compte de supervision MT5 dans votre formule actuelle. Pour le modifier, veuillez d'abord le délier.
              </p>
            </div>

            {/* Positions ouvertes */}
            <div className="glass-panel p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <Activity size={20} className="text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Positions Courantes</h2>
              </div>
              
              {loadingPositions ? (
                <div className="flex items-center gap-3 text-slate-400 py-8 justify-center">
                  <RefreshCw size={18} className="animate-spin text-blue-500" /> 
                  <p className="font-medium">Synchronisation Terminal...</p>
                </div>
              ) : positions.length > 0 ? (
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="px-6 sm:px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10">Actif</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10">Type</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10 text-right">Lots</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10 text-right">Ouverture</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10 text-right">Actuel</th>
                        <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/10 text-right">P&L</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {positions.map((pos) => (
                        <tr key={pos.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 sm:px-4 py-4 font-bold text-white">{pos.symbol}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wider uppercase ${
                                pos.type === "ORDER_TYPE_BUY"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {pos.type === "ORDER_TYPE_BUY" ? "BUY" : "SELL"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-slate-300">{pos.volume}</td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-slate-400">
                            {pos.openPrice?.toFixed(5)}
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-sm text-slate-300">
                            {pos.currentPrice?.toFixed(5)}
                          </td>
                          <td
                            className={`px-4 py-4 text-right font-mono font-bold ${
                              pos.profit >= 0
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {pos.profit >= 0 ? "+" : ""}${pos.profit?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="font-semibold text-slate-400 mb-1">Aucune position ouverte</p>
                  <p className="text-sm text-slate-500">Le terminal MT5 signale que toutes vos positions sont flaggées comme fermées.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="glass-panel text-center py-16 px-4">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Server size={32} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Aucun Terminal Connecté
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Liez votre compte MetaTrader 5 via notre interconnexion sécurisée MetaAPI pour synchroniser vos signaux en millisecondes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
