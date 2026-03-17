import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📥 Webhook Telegram reçu (BleuApp):", JSON.stringify(body).substring(0, 500));

    let message = body.message || body.channel_post || body.edited_message || body.edited_channel_post;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chat = message.chat;
    const text = message.text || message.caption;

    if (!chat || chat.type !== "channel" || !text) {
      return NextResponse.json({ ok: true });
    }

    const channelId = String(chat.id);
    console.log(`✅ Signal détecté depuis le canal chat_id: ${channelId}`);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Vérifier si le canal est autorisé dans BleuApp
    const { data: channel, error } = await supabase
      .from("telegram_channels")
      .select("id, chat_id, style, prefix")
      .eq("chat_id", channelId)
      .eq("is_active", true)
      .single();

    if (error || !channel) {
      console.log(`❌ Canal non autorisé dans le dashboard: ${channelId}`);
      return NextResponse.json({ ok: true });
    }

    // Le canal est autorisé, on transmet le message et les paramètres configurés à l'API de parsing interne
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/telegram/parse-signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: channel.id,
          chatId: channel.chat_id,
          style: channel.style,
          prefix: channel.prefix,
          messageText: text,
          messageId: message.message_id
        }),
      });

      const responseText = await response.text();
      console.log(`✅ Signal transmis au parser avec succès:`, responseText.substring(0, 100));
    } catch (error) {
      console.error("❌ Erreur de parsing interne:", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}

