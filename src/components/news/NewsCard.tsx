import Image from "next/image";
import { NewsArticle } from "@/types/news";
import NewsImageWithFallback from "./NewsImageWithFallback";

interface NewsCardProps {
  article: NewsArticle;
}

function timeSince(dateStr: string) {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " anos atrás";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses atrás";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " dias atrás";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas atrás";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " min atrás";
  return Math.floor(seconds) + " seg atrás";
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col md:flex-row gap-4 bg-surface-container-low hover:bg-surface-container-high transition-colors p-4 rounded-2xl border border-outline-variant/20 shadow-elevation-sm hover:shadow-elevation-md h-full"
    >
      {/* Imagem (se houver) */}
      <div className="relative w-full md:w-48 h-48 md:h-full shrink-0 rounded-xl overflow-hidden bg-surface-variant/30 flex items-center justify-center">
        <NewsImageWithFallback
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDyr8D7yUra4ZPFEo9fMCkJu_URmC5ZDVN8AfBIipp5kfZ69f2MIJHbYSIE8_M5DzaeG77twbmGbPuN1k2UNQXyVZJCyuKHtUSebTOv6EB5wCMAf0tpYzAGFHcQiUo1_2irxr7CNzfQkHCkALvmwIGGqGt0giigo6xSPFUunUETqtFVmXgapC8yDNVLV8aw4Uv2wdSw_s9dsmZ2IX8D8pyz6rHTCVP-f1Eyk2KSJ5r1CZP6FQknWQARxTwZWNSfvpAR8mrZ21_10R8"
          fallbackClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 mix-blend-luminosity"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-grow py-1 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-label-caps text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {article.source}
            </span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {timeSince(article.pubDate)}
            </span>
          </div>
          <h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
          <p className="font-body-md text-on-surface-variant line-clamp-3">
            {article.snippet}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-end text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
          <span className="font-label-caps text-sm mr-1">Ler Notícia</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>
      </div>
    </a>
  );
}
