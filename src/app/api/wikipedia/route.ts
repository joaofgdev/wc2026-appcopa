import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const ptTitle = searchParams.get("ptTitle") || title;

  try {
    // 1. Busca na Wikipedia em inglês para garantir uma boa imagem/thumbnail (já que en tem mais mídia)
    const enRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    const enData = enRes.ok ? await enRes.json() : null;

    // 2. Busca na Wikipedia em português para obter o texto traduzido nativamente da enciclopédia
    const ptRes = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(ptTitle)}`);
    const ptData = ptRes.ok ? await ptRes.json() : null;

    // Se nenhum dos dois achar nada, retorna 404
    if (!enData && !ptData) {
      return NextResponse.json({ error: "Wikipedia page not found" }, { status: 404 });
    }

    // Mesclamos: Imagem vem do Inglês (ou pt), Texto vem do Português (ou en)
    return NextResponse.json({
      title: ptData?.title || enData?.title,
      extract: ptData?.extract || enData?.extract,
      thumbnail: enData?.thumbnail?.source || ptData?.thumbnail?.source || null,
      originalImage: enData?.originalimage?.source || ptData?.originalimage?.source || null,
      pageUrl: ptData?.content_urls?.desktop?.page || enData?.content_urls?.desktop?.page,
    });
  } catch (error) {
    console.error("Wikipedia API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
