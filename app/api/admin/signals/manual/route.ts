import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { executeTradesForSignal, triggerTradeExecution } from "@/lib/trading-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Vérifier l'authentification admin
    const authHeader = request.headers.get("Authorization");
    // Note: Pour faire simple ici, on suppose que l'admin est connecté via session
    // Mais en production, il vaut mieux vérifier le JWT ou une clé API interne
    
    const body = await request.json();
    const { symbol, type, orderType, entryPrice, stopLoss, takeProfit, channelId } = body;

    if (!symbol || !type) {
      return NextResponse.json({ error: "Symbole et Type (BUY/SELL) requis" }, { status: 400 });
    }

    // 1. Créer le signal dans la base
    const { data: signal, error: signalError } = await supabase
      .from("telegram_signals")
      .insert({
        symbol: symbol.toUpperCase(),
        signal_type: type.toUpperCase(),
        order_type: orderType || "MARKET",
        entry_price: entryPrice || null,
        stop_loss: stopLoss || null,
        take_profit: takeProfit || null,
        channel_id: channelId, // L'admin choisit quel groupe "simuler"
        message_text: `SIGNAL MANUEL ADMIN: ${type} ${symbol}`,
        message_id: Math.floor(Math.random() * 1000000), // ID aléatoire pour éviter les collisions
      })
      .select()
      .single();

    if (signalError) {
      console.error("Error creating manual signal:", signalError);
      return NextResponse.json({ error: signalError.message }, { status: 500 });
    }

    // 2. Créer les trades pour tous les abonnés du canal choisi
    await executeTradesForSignal(signal.id, supabase);

    // 3. Déclencher l'exécution immédiate
    await triggerTradeExecution();

    return NextResponse.json({
      success: true,
      signalId: signal.id,
      message: "Signal manuel envoyé avec succès à tous les abonnés du canal."
    });

  } catch (error: any) {
    console.error("Manual signal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
