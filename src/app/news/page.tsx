import NewsList from "@/components/news/NewsList";
import Link from "next/link";

export default function NewsPage() {
  return (
    <main className="pt-24 pb-28 px-margin-mobile flex flex-col min-h-screen">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <h1 className="font-headline-md font-bold">Notícias da Copa</h1>
      </div>
      
      <NewsList />
    </main>
  );
}