import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { data: matches } = await supabase.from('matches').select('home_team_name, away_team_name, details_saved').lt('match_date', new Date().toISOString());
  return NextResponse.json({ matches });
}
