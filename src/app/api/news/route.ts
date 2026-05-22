import { NextResponse } from "next/server";
import { fetchAllFeeds } from "@/services/rss.service";
import { NewsResponse } from "@/types/news";
import { unstable_cache } from "next/cache";

// Cache agressivo de 30 minutos (1800 segundos) conforme requisito
const getCachedFeeds = unstable_cache(
  async () => {
    return await fetchAllFeeds();
  },
  ["news-rss-feeds-v1"],
  { revalidate: 1800, tags: ["news"] }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const q = searchParams.get("q")?.toLowerCase() || "";
    const team = searchParams.get("team")?.toLowerCase() || "";
    
    const limit = 10;
    const startIndex = (page - 1) * limit;

    // Busca feeds (cacheados)
    let articles = await getCachedFeeds();

    // Filtro por termo de pesquisa
    if (q) {
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.snippet.toLowerCase().includes(q)
      );
    }

    // Filtro por seleção (team)
    if (team) {
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(team) ||
          article.snippet.toLowerCase().includes(team)
      );
    }

    // Paginação
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedArticles = articles.slice(startIndex, startIndex + limit);

    const response: NewsResponse = {
      articles: paginatedArticles,
      total,
      page,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro no Route Handler de Notícias:", error);
    return NextResponse.json(
      { error: "Falha ao carregar notícias" },
      { status: 500 }
    );
  }
}
