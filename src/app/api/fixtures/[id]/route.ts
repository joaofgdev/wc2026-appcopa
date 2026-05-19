import { NextResponse } from "next/server";
import { getFixtureDetails } from "@/lib/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await getFixtureDetails(id);

    if (!match) {
      return NextResponse.json(
        { error: "Jogo não encontrado", match: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ match });
  } catch (error) {
    console.error("Erro ao buscar detalhes do jogo:", error);
    return NextResponse.json(
      { error: "Falha ao buscar detalhes do jogo", match: null },
      { status: 500 }
    );
  }
}
