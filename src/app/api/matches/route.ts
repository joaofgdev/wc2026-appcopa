import { NextResponse } from "next/server";
import { getWorldCupFixtures } from "@/lib/api";

export async function GET() {
  try {
    const matches = await getWorldCupFixtures();
    return NextResponse.json(matches);
  } catch (error) {
    console.error("Erro ao carregar matches", error);
    return NextResponse.json({ error: "Falha ao carregar jogos" }, { status: 500 });
  }
}
