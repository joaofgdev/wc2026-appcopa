import { NextResponse } from "next/server";

export async function GET() {
  try {
    const worldcupData = require("@/data/worldcup.json");
    // Retorna a lista de times únicos baseada no JSON estático
    const groups = worldcupData.groups as Record<string, string[]>;
    const allTeams = new Set<string>();
    
    for (const groupName in groups) {
      groups[groupName].forEach(team => allTeams.add(team));
    }
    
    return NextResponse.json(Array.from(allTeams));
  } catch (error) {
    return NextResponse.json({ error: "Falha ao carregar times" }, { status: 500 });
  }
}
