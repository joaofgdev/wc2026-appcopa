import { NextResponse } from "next/server";
import { getTestMatchStats as getMockStats, getTestMatchBase as getMockBase } from "@/mocks/test-match";
import { getFootballApiMatchBase, getFootballApiMatchStats } from "@/services/football-api.service";

export async function GET() {
  console.log("[CACHE HIT / CACHE MISS TEST] Rota /api/test-match/stats acessada");
  
  let base = await getFootballApiMatchBase();
  let stats = null;
  
  if (base) {
    stats = await getFootballApiMatchStats(base.id);
  }

  if (!stats) {
    console.log("[FALLBACK] API Stats falhou e Snapshot vazio. Usando Mock.");
    base = base || getMockBase();
    stats = getMockStats();
  }
  
  let revalidateTime = 3600;
  if (base?.status.short === "LIVE") {
    revalidateTime = 30;
  }

  return NextResponse.json(stats, {
    status: 200,
    headers: {
      "Cache-Control": `s-maxage=${revalidateTime}, stale-while-revalidate=15`,
    },
  });
}
