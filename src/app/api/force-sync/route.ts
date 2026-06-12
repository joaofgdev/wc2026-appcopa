import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  
  if (secret !== "copa2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Set details_saved to false for all past matches
  const now = new Date().toISOString();
  
  const { data: matches, error } = await supabase
    .from("matches")
    .select("id, home_team_name, away_team_name, match_date, details_saved")
    .lt("match_date", now);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const updatedIds = [];
  for (const match of matches || []) {
    // Force re-fetch by setting details_saved = false
    await supabase.from("matches").update({ details_saved: false }).eq("id", match.id);
    updatedIds.push(`${match.home_team_name} vs ${match.away_team_name}`);
  }

  return NextResponse.json({ success: true, updated: updatedIds });
}
