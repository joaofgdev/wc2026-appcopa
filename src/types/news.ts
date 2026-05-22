export interface NewsArticle {
  id: string;
  title: string;
  snippet: string;
  imageUrl: string | null;
  source: string;
  pubDate: string;
  url: string;
  priority?: number;
}

export interface NewsResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  totalPages: number;
}
