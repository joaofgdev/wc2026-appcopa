import Link from "next/link";
import { fetchAllFeeds } from "@/services/rss.service";
import { unstable_cache } from "next/cache";

const getCachedFeeds = unstable_cache(
  async () => {
    return await fetchAllFeeds();
  },
  ["news-rss-feeds-v1"],
  { revalidate: 1800, tags: ["news"] }
);

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

export default async function LatestNewsBanner() {
  let articles: any[] = [];
  
  try {
    const allFeeds = await getCachedFeeds();
    articles = allFeeds.slice(0, 5);
  } catch (err) {
    console.error("Erro ao carregar banner de notícias:", err);
  }

  if (articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "var(--font-sora), sans-serif",
          }}
        >
          Últimas Notícias
        </h2>
        <Link
          href="/news"
          className="flex items-center gap-1 no-underline hover:brightness-125 transition-all"
          style={{ fontSize: "13px", fontWeight: 600, color: "#65B1A3" }}
        >
          Ver Todas
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Cards de Notícia */}
      <div className="flex flex-col gap-3">
        {articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative w-full h-[180px] rounded-2xl overflow-hidden group cursor-pointer block transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${index > 0 ? "hidden md:block" : ""}`}
            style={{ border: "1px solid rgba(101,177,163,0.18)" }}
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyr8D7yUra4ZPFEo9fMCkJu_URmC5ZDVN8AfBIipp5kfZ69f2MIJHbYSIE8_M5DzaeG77twbmGbPuN1k2UNQXyVZJCyuKHtUSebTOv6EB5wCMAf0tpYzAGFHcQiUo1_2irxr7CNzfQkHCkALvmwIGGqGt0giigo6xSPFUunUETqtFVmXgapC8yDNVLV8aw4Uv2wdSw_s9dsmZ2IX8D8pyz6rHTCVP-f1Eyk2KSJ5r1CZP6FQknWQARxTwZWNSfvpAR8mrZ21_10R8"
                alt="Notícia"
                loading="lazy"
              />
            )}

            {/* Gradiente overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(5,20,24,0.95) 0%, rgba(5,20,24,0.5) 50%, transparent 100%)",
              }}
            />

            {/* Conteúdo */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    background: "#1F6663",
                    color: "#A8C5C2",
                    fontSize: "10px",
                    fontWeight: 600,
                    fontFamily: "var(--font-sora), sans-serif",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {article.source}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#A8C5C2",
                    fontFamily: "var(--font-sora), sans-serif",
                    opacity: 0.7,
                  }}
                >
                  {timeSinceShort(article.pubDate)} ATRÁS
                </span>
              </div>
              <h3
                className="line-clamp-2"
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sora), sans-serif",
                  lineHeight: 1.3,
                }}
              >
                {article.title}
              </h3>
            </div>

            {/* Botão de abrir */}
            <div
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
              style={{
                background: "rgba(5,20,24,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(101,177,163,0.25)",
                color: "#65B1A3",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
              >
                open_in_new
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
