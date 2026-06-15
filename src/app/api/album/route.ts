import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  
  if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

  try {
    const { data: invData } = await supabase.from("album_inventory").select("sticker_id, quantity").eq("user_id", userId);
    const { data: packData } = await supabase.from("album_packs").select("last_pack_opened_at").eq("user_id", userId).single();

    const inventory: Record<string, number> = {};
    if (invData) {
      invData.forEach(row => {
        inventory[row.sticker_id] = row.quantity;
      });
    }

    return NextResponse.json({
      inventory,
      lastOpenedAt: packData?.last_pack_opened_at || null
    });
  } catch (err) {
    console.error("Album GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
