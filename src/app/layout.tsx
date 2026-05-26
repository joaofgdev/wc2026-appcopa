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

import { UserProvider } from "@/contexts/UserContext";
import Header from "@/components/Header";
import UserProfileModal from "@/components/UserProfileModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tela de migração exclusiva para a Vercel
  if (process.env.VERCEL === "1") {
    return (
      <html lang="pt-BR" className={`${sora.variable} ${jakarta.variable} ${spaceMono.variable} dark`}>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        </head>
        <body suppressHydrationWarning className="antialiased selection:bg-brand-blue selection:text-white font-body-md bg-brand-bg text-white h-screen w-screen flex items-center justify-center">
          <main className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center gap-8">
            <h1 className="font-headline-lg text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-[#8A2BE2] to-brand-green drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] pb-1">
              WC2026
            </h1>
            
            <div className="flex flex-col gap-3">
              <h2 className="font-headline-sm text-2xl text-on-surface">Mudamos de casa! 🏠</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Esta aplicação não está mais hospedada aqui. O projeto oficial foi movido para o Netlify. Por favor, acesse nosso novo link para continuar acompanhando a Copa do Mundo.
              </p>
            </div>

            <a 
              href="https://wcusmxca2026.netlify.app/" 
              className="mt-2 flex items-center gap-2 bg-brand-blue text-white px-8 py-4 rounded-full font-label-caps font-bold hover:brightness-110 hover:shadow-[0_0_20px_rgba(47,78,254,0.4)] transition-all animate-bounce"
            >
              Acessar Novo Link
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </a>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR" className={`${sora.variable} ${jakarta.variable} ${spaceMono.variable} dark`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="antialiased overflow-x-hidden selection:bg-brand-blue selection:text-white font-body-md bg-brand-bg text-white">
        
        <UserProvider>
          {/* TopAppBar Dinâmica */}
          <Header />

          {/* Modal de Perfil Global */}
          <UserProfileModal />

          {/* O conteúdo de cada página entra aqui */}
          {children}

          {/* BottomNavBar Fixa */}
        <nav className="fixed bottom-0 w-full rounded-t-xl z-50 pb-[env(safe-area-inset-bottom)] border-t border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-20 px-2 md:hidden">
          <Link href="/" className="flex flex-col items-center justify-center text-brand-blue active:scale-90 transition-all duration-200">
            <span className="material-symbols-outlined text-[28px]">sports_soccer</span>
          </Link>
          <Link href="/bracket" className="flex flex-col items-center justify-center text-brand-blue active:scale-90 duration-200">
            <span className="material-symbols-outlined text-[28px]">account_tree</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center justify-center text-brand-blue active:scale-90 duration-200">
            <span className="material-symbols-outlined text-[28px]">flag</span>
          </Link>
          <Link href="/news" className="flex flex-col items-center justify-center text-brand-blue active:scale-90 duration-200">
            <span className="material-symbols-outlined text-[28px]">article</span>
          </Link>
          <Link href="/brazil" className="flex flex-col items-center justify-center text-brand-blue active:scale-90 duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0">
              <rect width="22" height="16" x="1" y="4" rx="2" fill="#00C752" />
              <polygon points="12 6 20 12 12 18 4 12" fill="#FFE500" />
              <circle cx="12" cy="12" r="3" fill="#2F4EFE" />
            </svg>
          </Link>
        </nav>
        </UserProvider>
      </body>
    </html>
  );
}