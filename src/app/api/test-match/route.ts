import { NextResponse } from "next/server";
import { getTestMatchBase as getMockBase } from "@/mocks/test-match";
import { getFootballApiMatchBase } from "@/services/football-api.service";

export async function GET() {
  console.log("[CACHE HIT / CACHE MISS TEST] Rota /api/test-match processando Server Side");
  
  let data = await getFootballApiMatchBase();
  
  if (!data) {
    console.log("[FALLBACK] API falhou ou não encontrou o jogo e Snapshot estava vazio. Usando Mock Hardcoded inicial.");
    data = getMockBase();
  }
  
  // Lógica Dinâmica de Cache conforme o Status
  let revalidateTime = 3600; // 1 Hora por padrão
  
  if (data.status.short === "LIVE") {
    revalidateTime = 30; // 30 Segundos se estiver ao vivo
    console.log(`[CACHE LOGIC] Jogo AO VIVO. Tempo de Cache (revalidate) ajustado para: ${revalidateTime}s`);
  } else {
    console.log(`[CACHE LOGIC] Jogo ESTÁTICO (${data.status.short}). Tempo de Cache (revalidate) ajustado para: ${revalidateTime}s`);
  }

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": `s-maxage=${revalidateTime}, stale-while-revalidate=15`,
    },
  });
}
