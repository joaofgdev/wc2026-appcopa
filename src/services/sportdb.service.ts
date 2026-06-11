import { isDevelopment } from "@/utils/environment";

const API_BASE = "https://api.sportdb.dev";
const WORLD_CUP_PATH = "/api/flashscore/football/world:8/world-cup:lvUBR5F8/2026";

export function getDynamicTTL(): number {
  const now = Date.now();
  // Início da Copa: 11/06/2026
  const wcStart = new Date("2026-06-11T00:00:00Z").getTime();
  
  if (now < wcStart) {
    return 86400; // 24 horas fora de copa
  }
  return 3600; // 1 hora durante a copa
}

export async function fetchFromSportDB<T>(endpoint: string, customRevalidate?: number): Promise<T> {

  const apiKey = process.env.SPORTDB_API_KEY;
  if (!apiKey) {
    throw new Error("SPORTDB_API_KEY não está configurada no .env.local");
  }

  const revalidate = customRevalidate !== undefined ? customRevalidate : getDynamicTTL();
  
  let url = "";
  if (endpoint.startsWith("/match/")) {
    url = `${API_BASE}/api/flashscore${endpoint}`;
  } else {
    url = `${API_BASE}${WORLD_CUP_PATH}${endpoint}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
    next: { revalidate }, // Cache robusto do Next.js App Router
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
