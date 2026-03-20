import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { closeAllPositions } from "@/lib/trading-service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { symbol } = body;

    console.log(`🚨 EMERGENCY CLOSE-ALL REQUESTED for symbol: ${symbol || 'ALL'}`);

    // 1. Récupérer tous les comptes MT5 actifs
    const { data: accounts, error: accountsError } = await supabase
      .from("mt5_accounts")
      .select("id, metaapi_account_id, user_id")
      .eq("is_active", true);

    if (accountsError) throw accountsError;

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ success: true, message: "Aucun compte MT5 actif trouvé." });
    }

    let totalClosed = 0;
    const results = [];

    // 2. Pour chaque compte, fermer les positions
    for (const account of accounts) {
      if (!account.metaapi_account_id) continue;
      
      console.log(`🧹 Closing positions for account ${account.metaapi_account_id} (User: ${account.user_id})`);
      const res = await closeAllPositions(account.metaapi_account_id, symbol);
      
      if (res.success) {
        totalClosed += (res.closed || 0);
        results.push({ accountId: account.id, status: "success", closed: res.closed });
      } else {
        results.push({ accountId: account.id, status: "error", error: res.error });
      }
    }

    return NextResponse.json({
      success: true,
      totalClosed,
      details: results,
      message: `${totalClosed} position(s) fermée(s) au total.`
    });

  } catch (error: any) {
    console.error("Emergency close-all error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
