import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings, Key, Globe, Bell, Shield } from "lucide-react";

export default async function AdminSettingsPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          Paramètres
        </h1>
        <p className="text-slate-400 mt-1">Configuration globale de votre plateforme BleuApp.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* API Keys */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
            <Key className="text-amber-400" size={22} />
            <h2 className="text-lg font-bold text-white">Clés API</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">MetaAPI</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.METAAPI_TOKEN ? "✓ Configuré" : "✗ Manquant"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">OpenAI (ChatGPT)</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.OPENAI_API_KEY ? "✓ Configuré" : "✗ Manquant"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Stripe</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.STRIPE_SECRET_KEY ? "✓ Configuré" : "✗ Manquant"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Telegram Bot</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.TELEGRAM_BOT_TOKEN ? "✓ Configuré" : "✗ Manquant"}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Info */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
            <Globe className="text-blue-400" size={22} />
            <h2 className="text-lg font-bold text-white">Plateforme</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">URL de l'application</span>
              <span className="text-slate-300 font-mono text-xs">{process.env.NEXT_PUBLIC_APP_URL || "Non définie"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Supabase</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Connecté" : "✗ Manquant"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Environnement</span>
              <span className="text-blue-400 font-mono text-xs bg-blue-500/10 px-2 py-1 rounded">
                {process.env.NODE_ENV || "development"}
              </span>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
            <Bell className="text-indigo-400" size={22} />
            <h2 className="text-lg font-bold text-white">Webhooks</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Stripe Webhook</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.STRIPE_WEBHOOK_SECRET ? "✓ Actif" : "✗ Inactif"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Telegram Webhook</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">Actif</span>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
            <Shield className="text-rose-400" size={22} />
            <h2 className="text-lg font-bold text-white">Sécurité</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Supabase Service Role</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">
                {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Actif" : "✗ Manquant"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">RLS (Row Level Security)</span>
              <span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">✓ Activé</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-200 flex gap-3">
        <Globe size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <span>
          Les variables d'environnement sont définies sur votre hébergeur (Render). Pour les modifier, accédez au dashboard Render &gt; Environment.
        </span>
      </div>
    </div>
  );
}
