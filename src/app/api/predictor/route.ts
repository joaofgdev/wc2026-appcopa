import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Instancia um client do Supabase usando a Service Role Key para ignorar RLS
// e garantir que apenas essa API tenha acesso total à tabela bracket_predictions.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("bracket_predictions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found, means user has no predictions yet
        return NextResponse.json({ predictions: null });
      }
      throw error;
    }

    return NextResponse.json({ predictions: data });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userName, picks } = body;

    if (!userId || !userName || !picks) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert the user's predictions
    const { data, error } = await supabase
      .from("bracket_predictions")
      .upsert({
        user_id: userId,
        user_name: userName,
        picks: picks,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, predictions: data });
  } catch (error) {
    console.error("Error saving predictions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
