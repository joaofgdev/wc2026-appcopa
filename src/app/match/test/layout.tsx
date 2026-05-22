import Link from "next/link";
import { ReactNode } from "react";

export default function TestMatchLayout({ children }: { children: ReactNode }) {
  return (
    <main className="pt-20 pb-28 px-margin-mobile flex flex-col min-h-screen max-w-4xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="font-label-caps text-sm text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          AMBIENTE DE TESTE (LIVE SCORE)
        </span>
      </div>

      <nav className="flex gap-4 mb-6 border-b border-outline-variant/30 pb-2">
        <Link href="/match/test" className="font-label-caps font-bold hover:text-primary transition-colors text-on-surface">Resumo</Link>
        <Link href="/match/test/stats" className="font-label-caps font-bold hover:text-primary transition-colors text-on-surface">Estatísticas</Link>
        <Link href="/match/test/lineups" className="font-label-caps font-bold hover:text-primary transition-colors text-on-surface">Escalações</Link>
      </nav>

      <div className="flex flex-col gap-6">
        {children}
      </div>
    </main>
  );
}
