import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hidden md:flex flex-col items-center justify-center gap-4 py-8 mt-12 border-t border-outline-variant/20 bg-surface-container-lowest/50 text-on-surface-variant w-full">
      <div className="flex gap-6 font-label-caps">
        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
        <Link href="/bracket" className="hover:text-primary transition-colors">Mata-Mata</Link>
        <Link href="/explore" className="hover:text-primary transition-colors">Explorar</Link>
        <Link href="/news" className="hover:text-primary transition-colors">Notícias</Link>
      </div>
      <p className="text-xs font-body-md opacity-60">
        © 2026 WC2026. Todos os direitos reservados.
      </p>
    </footer>
  );
}
