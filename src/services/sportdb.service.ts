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
  // Em desenvolvimento, retorna JSON estático instantaneamente, custo zero.
  if (isDevelopment) {
    try {
      if (endpoint.includes("fixtures")) {
        const data = await import("@/mocks/fixtures.json");
        return data.default as T;
      }
      if (endpoint.includes("results")) {
        const data = await import("@/mocks/results.json");
        return data.default as T;
      }
    } catch (e) {
      console.warn("Mock não encontrado, retornando vazio", e);
    }
    return [] as unknown as T;
  }

  const apiKey = process.env.SPORTDB_API_KEY;
  if (!apiKey) {
    throw new Error("SPORTDB_API_KEY não está configurada no .env.local");
  }

  const revalidate = customRevalidate !== undefined ? customRevalidate : getDynamicTTL();
  const url = `${API_BASE}${WORLD_CUP_PATH}${endpoint}`;

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
