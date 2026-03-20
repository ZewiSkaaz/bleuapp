import { createClient } from "@supabase/supabase-js";

/**
 * Normalise un symbole (XAUUSD -> GOLD, XAUUSD.I -> GOLD, etc.)
 */
export function normalizeSymbol(symbol: string): string {
  const upperSymbol = symbol.toUpperCase().trim();

  if (upperSymbol.includes("XAU") || upperSymbol.includes("GOLD")) {
    return "GOLD";
  }

  if (upperSymbol.includes("US30") || upperSymbol.includes("DJ30") || upperSymbol.includes("WS30") || upperSymbol.includes("DOW")) {
    return "US30";
  }
  
  if (upperSymbol.includes("NAS100") || upperSymbol.includes("US100") || upperSymbol.includes("USTEC") || upperSymbol.includes("NASDAQ")) {
    return "NAS100";
  }
  
  if (upperSymbol.includes("GER40") || upperSymbol.includes("DAX") || upperSymbol.includes("DE40") || upperSymbol.includes("GER30")) {
    return "GER40";
  }

  if (upperSymbol.includes("SOL")) {
    return "SOL30";
  }

  if (upperSymbol.includes("BTC") || upperSymbol.includes("BITCOIN")) {
    return "BTC";
  }

  return upperSymbol.replace(/[._\/]/g, "");
}

/**
 * Mappe un symbole normalisé au symbole utilisé par un broker spécifique
 */
export async function mapSymbolToBroker(
  normalizedSymbol: string,
  brokerName: string | null,
  supabase: any
): Promise<string> {
  if (!brokerName) return normalizedSymbol;

  const normalizedBrokerName = brokerName.trim();
  
  // 1. Essayer de récupérer depuis la table symbol_mappings
  try {
    const { data: symbolMapping, error } = await supabase
      .from("symbol_mappings")
      .select("broker_symbol")
      .eq("broker_name", normalizedBrokerName)
      .eq("standard_symbol", normalizedSymbol)
      .single();

    if (!error && symbolMapping?.broker_symbol) {
      return symbolMapping.broker_symbol;
    }
  } catch (error) {
    console.warn(`⚠️ Erreur lecture symbol_mappings:`, error);
  }

  // 2. Fallback
  const fallbackMapping: Record<string, Record<string, string>> = {
    GOLD: { "VT Markets": "XAUUSD-ECN", "Raise FX": "XAUUSD", "FXcess": "XAUUSD" },
    EURUSD: { "VT Markets": "EURUSD-ECN" },
    US30: { "VT Markets": "US30.cash-ECN" },
    NAS100: { "VT Markets": "NAS100.cash-ECN" },
    GER40: { "VT Markets": "GER40.cash-ECN" },
  };

  if (fallbackMapping[normalizedSymbol]?.[normalizedBrokerName]) {
    return fallbackMapping[normalizedSymbol][normalizedBrokerName];
  }

  return normalizedSymbol;
}

/**
 * Exécute les trades pour un signal donné (création des entrées telegram_trades)
 */
export async function executeTradesForSignal(signalId: string, supabase: any) {
  // Récupérer le signal
  const { data: signal } = await supabase
    .from("telegram_signals")
    .select("*")
    .eq("id", signalId)
    .single();

  if (!signal) return;

  // Récupérer les abonnés actifs
  const { data: subscriptions } = await supabase
    .from("user_telegram_subscriptions")
    .select("user_id")
    .eq("channel_id", signal.channel_id)
    .eq("is_active", true);

  if (!subscriptions || subscriptions.length === 0) return;

  // Filtrer par abonnements Stripe actifs
  const { data: activeSubs } = await supabase
    .from("subscriptions")
    .select("user_id")
    .in("user_id", subscriptions.map((s: any) => s.user_id))
    .in("status", ["active", "trialing"]);

  const activeUserIds = new Set(activeSubs?.map((s: any) => s.user_id) || []);
  const normalizedSymbol = normalizeSymbol(signal.symbol);

  for (const subscription of subscriptions) {
    if (!activeUserIds.has(subscription.user_id)) continue;

    // Compte MT5
    const { data: mt5Account } = await supabase
      .from("mt5_accounts")
      .select("id, metaapi_account_id, broker_name")
      .eq("user_id", subscription.user_id)
      .eq("is_active", true)
      .single();

    if (!mt5Account?.metaapi_account_id) continue;

    // Settings
    const { data: settings } = await supabase
      .from("trading_settings")
      .select("*")
      .eq("user_id", subscription.user_id)
      .single();

    let userVolume = signal.volume || 0.01;
    if (settings?.position_sizing_type === "lot") {
      const lotKey = `${normalizedSymbol.toLowerCase()}_lot_size`;
      userVolume = parseFloat(settings[lotKey]) || 0.01;
    }

    const brokerSymbol = await mapSymbolToBroker(normalizedSymbol, mt5Account.broker_name, supabase);

    await supabase.from("telegram_trades").insert({
      user_id: subscription.user_id,
      signal_id: signalId,
      mt5_account_id: mt5Account.id,
      symbol: brokerSymbol,
      signal_type: signal.signal_type,
      order_type: signal.order_type || (signal.entry_price ? "LIMIT" : "MARKET"),
      volume: userVolume,
      entry_price: signal.entry_price,
      stop_loss: signal.stop_loss,
      take_profit: signal.take_profit,
      status: "pending",
    });
  }
}

/**
 * Clôture toutes les positions pour un utilisateur (ou un symbole spécifique)
 */
export async function closeAllPositions(mt5AccountId: string, symbol?: string) {
  const token = process.env.META_API_TOKEN || process.env.METAAPI_TOKEN;
  if (!token) throw new Error("METAAPI_TOKEN non configuré");

  // On désactive la vérification SSL si nécessaire (fix temporaire)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const baseUrl = "https://mt-client-api-v1.london.agiliumtrade.ai";
  const url = `${baseUrl}/users/current/accounts/${mt5AccountId}/positions`;

  try {
    // 1. Récupérer les positions
    const res = await fetch(url, {
      headers: { "auth-token": token }
    });
    
    if (!res.ok) return { error: `Failed to fetch positions: ${res.status}` };
    const positions = await res.json();

    if (!Array.isArray(positions) || positions.length === 0) {
      return { success: true, closed: 0, message: "Aucune position à fermer" };
    }

    // 2. Filtrer par symbole si demandé
    const toClose = symbol 
      ? positions.filter(p => normalizeSymbol(p.symbol) === normalizeSymbol(symbol))
      : positions;

    let closedCount = 0;
    for (const pos of toClose) {
      const closeUrl = `${baseUrl}/users/current/accounts/${mt5AccountId}/positions/${pos.id}`;
      const closeRes = await fetch(closeUrl, {
        method: "DELETE",
        headers: { "auth-token": token }
      });
      if (closeRes.ok) closedCount++;
    }

    return { success: true, closed: closedCount };

  } catch (error: any) {
    console.error("Error in closeAllPositions:", error);
    return { error: error.message };
  }
}

/**
 * Déclenche l'exécution des trades en attente via l'API
 */
export async function triggerTradeExecution() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/telegram/execute-trades`, { method: "POST" });
  } catch (error) {
    console.error("Error triggering trade execution:", error);
  }
}
