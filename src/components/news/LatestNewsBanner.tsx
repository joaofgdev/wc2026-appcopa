"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsResponse, NewsArticle } from "@/types/news";

function timeSinceShort(dateStr: string) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "A";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "M";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "D";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "H";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "MIN";
  return Math.floor(seconds) + "S";
}

export default function LatestNewsBanner() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestNews() {
      try {
        const res = await fetch("/api/news?page=1");
        if (!res.ok) throw new Error("Falha ao buscar");
        const data: NewsResponse = await res.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles.slice(0, 5));
        }
      } catch (err) {
        console.error("Erro ao carregar banner de notícias:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`relative w-full h-[180px] rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20 animate-pulse ${i > 0 ? "hidden md:block" : ""}`}></div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-sm text-white font-bold text-2xl">
          Últimas Notícias
        </h2>
        <Link 
          href="/news" 
          className="flex items-center gap-1 text-primary text-sm font-bold no-underline hover:underline"
        >
          Ver Todas
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {articles.map((article, index) => (
          <a 
            key={index}
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`relative w-full h-[180px] rounded-xl overflow-hidden group cursor-pointer border border-outline-variant/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] block ${index > 0 ? "hidden md:block" : ""}`}
          >
            {article.imageUrl ? (
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={article.imageUrl} 
                alt={article.title} 
                loading="lazy"
              />
            ) : (
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyr8D7yUra4ZPFEo9fMCkJu_URmC5ZDVN8AfBIipp5kfZ69f2MIJHbYSIE8_M5DzaeG77twbmGbPuN1k2UNQXyVZJCyuKHtUSebTOv6EB5wCMAf0tpYzAGFHcQiUo1_2irxr7CNzfQkHCkALvmwIGGqGt0giigo6xSPFUunUETqtFVmXgapC8yDNVLV8aw4Uv2wdSw_s9dsmZ2IX8D8pyz6rHTCVP-f1Eyk2KSJ5r1CZP6FQknWQARxTwZWNSfvpAR8mrZ21_10R8" 
                alt="Notícia" 
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary text-on-primary font-label-caps text-[10px] px-2 py-0.5 rounded uppercase">
                  {article.source}
                </span>
                <span className="font-label-caps text-[10px] text-on-surface-variant">
                  {timeSinceShort(article.pubDate)} ATRÁS
                </span>
              </div>
              <h3 className="font-headline-sm text-[20px] leading-tight text-white font-bold line-clamp-2">
                {article.title}
              </h3>
            </div>
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/50 backdrop-blur-md border border-outline-variant flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>open_in_new</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
