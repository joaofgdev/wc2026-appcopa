import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { NewsArticle } from "@/types/news";

// Configuração do Parser com campos customizados
const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "enclosure", "description"],
  },
});

// Feeds focados na Copa 2026 e Futebol Internacional
const FEEDS = [
  {
    url: "https://trivela.com.br/feed/",
    source: "Trivela",
    translate: false,
    priority: 2,
  },
  {
    url: "https://www.skysports.com/rss/12040",
    source: "Sky Sports",
    translate: true,
    priority: 1,
  },
  {
    url: "https://www.ogol.com.br/rss/rss_noticias.php",
    source: "Ogol",
    translate: false,
    priority: 1,
  },
  {
    url: "https://www.gazetaesportiva.com/feed/",
    source: "Gazeta Esportiva",
    translate: false,
    priority: 0,
  },
  {
    url: "https://news.google.com/rss/search?q=Copa+do+Mundo+2026+OR+Seleção+Brasileira&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    source: "Google News",
    translate: false,
    priority: 0,
  },
  {
    url: "https://www.espn.com/espn/rss/soccer/news",
    source: "ESPN FC",
    translate: true,
    priority: 0,
  },
  {
    url: "http://feeds.bbci.co.uk/sport/football/rss.xml",
    source: "BBC Sport",
    translate: true,
    priority: 0,
  },
];

// Tradutor via API gratuita do Google (GTX)
async function translateText(text: string): Promise<string> {
  if (!text) return text;
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join("");
  } catch (e) {
    console.error("Erro na tradução:", e);
    return text;
  }
}

// Função auxiliar para extrair imagem do conteúdo HTML usando Cheerio
function extractImageFromHtml(html?: string): string | null {
  if (!html) return null;
  const $ = cheerio.load(html);
  const img = $("img").first().attr("src");
  return img || null;
}

// Limpa HTML do snippet e previne snippets vazios
function cleanSnippet(html?: string, title?: string): string {
  if (!html) return title || "";
  const $ = cheerio.load(html);
  const text = $.text().trim();
  // Pega até 150 caracteres para um snippet conciso
  return text.length > 150 ? text.substring(0, 147) + "..." : text;
}

// Extrai imagem principal da notícia com vários fallbacks
function extractImage(item: any, htmlContent?: string): string | null {
  if (item["media:content"] && item["media:content"]["$"] && item["media:content"]["$"].url) {
    return item["media:content"]["$"].url;
  }
  if (item["media:thumbnail"] && item["media:thumbnail"]["$"] && item["media:thumbnail"]["$"].url) {
    return item["media:thumbnail"]["$"].url;
  }
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  return extractImageFromHtml(htmlContent);
}

export async function fetchAllFeeds(): Promise<NewsArticle[]> {
  const allArticles: NewsArticle[] = [];

  // Busca em paralelo para performance máxima
  const fetchPromises = FEEDS.map(async (feedInfo) => {
    try {
      const feed = await parser.parseURL(feedInfo.url);
      const items = await Promise.all(
        feed.items.map(async (item) => {
          // Fallbacks de conteúdo
          const content = item.contentSnippet || item.content || item.description;
          const htmlContent = item.content || item.description;
          
          let title = item.title || "Notícia sem título";
          let snippet = cleanSnippet(content, item.title);

          if (feedInfo.translate) {
            title = await translateText(title);
            snippet = await translateText(snippet);
          }
          
          return {
            id: item.guid || item.link || Buffer.from(title).toString("base64"),
            title,
            snippet,
            imageUrl: extractImage(item, htmlContent),
            source: feedInfo.source,
            pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            url: item.link || "",
            priority: feedInfo.priority,
          };
        })
      );
      return items;
    } catch (error) {
      console.error(`Erro ao buscar feed ${feedInfo.source}:`, error);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  results.forEach((articles) => allArticles.push(...articles));

  // Remove duplicatas baseadas no link ou título exato
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();
  const uniqueArticles = allArticles.filter((article) => {
    if (seenLinks.has(article.url) || seenTitles.has(article.title)) return false;
    seenLinks.add(article.url);
    seenTitles.add(article.title);
    return true;
  });

  // Ordena por prioridade (ge primeiro) e depois da mais recente para a mais antiga
  uniqueArticles.sort((a, b) => {
    if (a.priority !== b.priority) {
      // Prioridades maiores primeiro
      return (b.priority as number) - (a.priority as number);
    }
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return uniqueArticles;
}
