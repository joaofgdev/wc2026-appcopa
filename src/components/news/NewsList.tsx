"use client";

import { useState, useEffect } from "react";
import NewsCard from "./NewsCard";
import NewsFilter from "./NewsFilter";
import { NewsResponse, NewsArticle } from "@/types/news";

export default function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError("");
        
        const params = new URLSearchParams({
          page: page.toString(),
          q: searchQuery,
          team: teamFilter,
        });

        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error("Falha ao carregar notícias");
        
        const data: NewsResponse = await res.json();
        setArticles(data.articles);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Erro no fetchNews:", err);
        setError("Não foi possível carregar as notícias. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [page, searchQuery, teamFilter]);

  // Reseta a página para 1 quando mudar filtros
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleTeamChange = (team: string) => {
    setTeamFilter(team);
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-headline-lg text-on-surface mb-2">Últimas Notícias</h2>
        <p className="font-body-md text-on-surface-variant">
          Fique por dentro das últimas novidades da Copa do Mundo 2026.
        </p>
      </div>

      <NewsFilter onSearchChange={handleSearchChange} onTeamChange={handleTeamChange} />

      {/* Estados de Erro e Vazio */}
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-body-md">{error}</p>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant bg-surface-container/30 rounded-3xl border border-outline-variant/30 border-dashed">
          <span className="material-symbols-outlined text-[64px] opacity-40 mb-4">search_off</span>
          <p className="font-headline-sm">Nenhuma notícia encontrada.</p>
          <p className="font-body-md mt-2">Tente buscar por outros termos ou seleções.</p>
        </div>
      )}

      {/* Lista de Skeletons (Loading) ou Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md lg:gap-stack-lg">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 animate-pulse h-full min-h-[224px]"
              >
                <div className="w-full md:w-48 h-48 md:h-full shrink-0 rounded-xl bg-surface-variant/40"></div>
                <div className="flex flex-col flex-grow py-2 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-1/3 bg-surface-variant/40 rounded-full mb-2"></div>
                    <div className="h-6 w-full bg-surface-variant/40 rounded-md"></div>
                    <div className="h-6 w-4/5 bg-surface-variant/40 rounded-md"></div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="h-4 w-full bg-surface-variant/40 rounded-md"></div>
                    <div className="h-4 w-2/3 bg-surface-variant/40 rounded-md"></div>
                  </div>
                </div>
              </div>
            ))
          : articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
      </div>

      {/* Paginação */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-outline-variant/30 shadow-elevation-sm hover:shadow-elevation-md"
            aria-label="Página anterior"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          
          <span className="font-label-caps text-sm text-on-surface-variant">
            Página {page} de {totalPages}
          </span>
          
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-outline-variant/30 shadow-elevation-sm hover:shadow-elevation-md"
            aria-label="Próxima página"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
