import { NextResponse } from "next/server";
import { getWorldCupFixtures } from "@/lib/api";

export async function GET() {
  try {
    const fixtures = await getWorldCupFixtures();
    return NextResponse.json({ fixtures });
  } catch (error) {
    console.error("Erro ao buscar fixtures:", error);
    return NextResponse.json(
      { error: "Falha ao buscar jogos da Copa", fixtures: [] },
      { status: 500 }
    );
  }
}
