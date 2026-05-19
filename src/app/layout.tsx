import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Configuração otimizada das fontes do Google
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "WC2026 - Início",
  description: "Acompanhe a Copa do Mundo 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${jakarta.variable} ${spaceMono.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden selection:bg-primary selection:text-on-primary font-body-md">
        
        {/* TopAppBar Fixa */}
        <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl dark:bg-surface-container/60 border-b border-outline-variant/30 shadow-[0_0_15px_rgba(204,189,255,0.3)] flex items-center justify-center px-margin-mobile h-16">
          <h1 className="font-headline-sm text-headline-sm-mobile tracking-tight font-display-lg-mobile text-display-lg-mobile text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            WC2026
          </h1>
        </header>

        {/* O conteúdo de cada página entra aqui */}
        {children}

        {/* BottomNavBar Fixa */}
        <nav className="fixed bottom-0 w-full rounded-t-xl z-50 pb-[env(safe-area-inset-bottom)] border-t border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-20 px-2 md:hidden">
          <Link href="/" className="flex flex-col items-center justify-center text-tertiary bg-tertiary-container/20 rounded-full px-4 py-1 shadow-[0_0_10px_rgba(0,230,57,0.4)] active:scale-90 transition-all duration-200">
            <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
            <span className="font-label-caps text-[10px]">Jogos</span>
          </Link>
          <Link href="/bracket" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined mb-1">account_tree</span>
            <span className="font-label-caps text-[10px]">Chaves</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined mb-1">public</span>
            <span className="font-label-caps text-[10px]">Explorar</span>
          </Link>
          <Link href="/news" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-200">
            <span className="material-symbols-outlined mb-1">movie</span>
            <span className="font-label-caps text-[10px]">Notícias</span>
          </Link>

        </nav>

      </body>
    </html>
  );
}