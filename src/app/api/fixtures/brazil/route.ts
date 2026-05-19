import { NextResponse } from "next/server";
import { getNextBrazilMatch } from "@/lib/api";

export async function GET() {
  try {
    const match = await getNextBrazilMatch();
    return NextResponse.json({ match });
  } catch (error) {
    console.error("Erro ao buscar jogo do Brasil:", error);
    return NextResponse.json(
      { error: "Falha ao buscar jogo do Brasil", match: null },
      { status: 500 }
    );
  }
}
