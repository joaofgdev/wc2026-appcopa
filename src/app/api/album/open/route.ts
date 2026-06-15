import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ALL_STICKERS } from "@/lib/albumData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

const RATES = {
  legendary: 0.02,
  epic: 0.08,
  rare: 0.20,
  common: 0.70
};

const STICKERS_BY_RARITY = {
  legendary: ALL_STICKERS.filter(s => s.rarity === 'legendary'),
  epic: ALL_STICKERS.filter(s => s.rarity === 'epic'),
  rare: ALL_STICKERS.filter(s => s.rarity === 'rare'),
  common: ALL_STICKERS.filter(s => s.rarity === 'common'),
};

function rollSticker() {
  const r = Math.random();
  let rarity: "legendary" | "epic" | "rare" | "common" = "common";
  if (r <= RATES.legendary) rarity = "legendary";
  else if (r <= RATES.legendary + RATES.epic) rarity = "epic";
  else if (r <= RATES.legendary + RATES.epic + RATES.rare) rarity = "rare";

  const list = STICKERS_BY_RARITY[rarity];
  const item = list[Math.floor(Math.random() * list.length)];
  return item.id;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, forceOpen } = body;
    
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const now = new Date();

    // 1. Verificação de Tempo (Ignora se for passado forceOpen para testes)
    if (!forceOpen) {
      const { data: packData } = await supabase.from("album_packs").select("last_pack_opened_at").eq("user_id", userId).single();
      if (packData?.last_pack_opened_at) {
        const lastDate = new Date(packData.last_pack_opened_at);
        const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
        if (diffHours < 20) { // Pode abrir a cada 20h
          return NextResponse.json({ error: "Você já abriu seu pacote diário!", nextAvailableInHours: 20 - diffHours }, { status: 403 });
        }
      }
    }

    // 2. Sortear as 5 figurinhas
    const pulledStickers = [rollSticker(), rollSticker(), rollSticker(), rollSticker(), rollSticker()];

    // 3. Registrar abertura do pacote
    const { error: packError } = await supabase.from("album_packs").upsert({
      user_id: userId,
      last_pack_opened_at: now.toISOString(),
      updated_at: now.toISOString()
    }, { onConflict: 'user_id' });

    if (packError) throw new Error("Erro ao salvar pack: " + packError.message);

    // 4. Salvar inventário
    const { data: existingData } = await supabase.from("album_inventory")
      .select("sticker_id, quantity")
      .eq("user_id", userId)
      .in("sticker_id", pulledStickers);

    const existingMap = new Map((existingData || []).map(r => [r.sticker_id, r.quantity]));

    const counts = pulledStickers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const upserts = Object.keys(counts).map(id => {
      const oldQtd = existingMap.get(id) || 0;
      return {
        user_id: userId,
        sticker_id: id,
        quantity: oldQtd + counts[id],
        updated_at: now.toISOString()
      };
    });

    const { error: invError } = await supabase.from("album_inventory").upsert(upserts, { onConflict: 'user_id, sticker_id' });
    if (invError) {
        throw new Error("Erro ao salvar inventário: " + invError.message);
    }

    return NextResponse.json({ success: true, pulledStickers });
  } catch (err: any) {
    console.error("FATAL ERROR IN POST /api/album/open:", err);
    return NextResponse.json({ error: err.message || "Erro interno do servidor" }, { status: 500 });
  }
}
