import { NextResponse } from "next/server";
import { getTestMatchLineups as getMockLineups } from "@/mocks/test-match";
import { getFootballApiMatchBase, getFootballApiMatchLineups } from "@/services/football-api.service";

export async function GET() {
  console.log("[CACHE HIT / CACHE MISS TEST] Rota /api/test-match/lineups acessada");
  
  const base = await getFootballApiMatchBase();
  let lineups = null;
  
  if (base) {
    lineups = await getFootballApiMatchLineups(base.id);
  }

  if (!lineups) {
    console.log("[FALLBACK] API Lineups falhou e Snapshot vazio. Usando Mock.");
    lineups = getMockLineups();
  }
  
  // Escalações não mudam muito, podemos usar cache mais longo mesmo ao vivo.
  const revalidateTime = 3600; 

  return NextResponse.json(lineups, {
    status: 200,
    headers: {
      "Cache-Control": `s-maxage=${revalidateTime}, stale-while-revalidate=60`,
    },
  });
}
