import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: teams, error } = await supabase
      .from('teams')
      .select('name')
      .order('name');
      
    if (error) {
      throw error;
    }
    
    const teamNames = teams.map(t => t.name);
    return NextResponse.json(teamNames);
  } catch (error) {
    console.error("Erro ao carregar times:", error);
    return NextResponse.json({ error: "Falha ao carregar times" }, { status: 500 });
  }
}
