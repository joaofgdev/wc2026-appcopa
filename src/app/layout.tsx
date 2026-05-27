import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

// Sora: light (300) ao bold (700) — fonte principal do novo design
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WC2026 - Início",
  description: "Acompanhe a Copa do Mundo 2026",
  icons: {
    icon: "/logo/icon.svg",
  },
};

import { UserProvider } from "@/contexts/UserContext";
import Header from "@/components/Header";
import UserProfileModal from "@/components/UserProfileModal";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import BottomNavClient from "@/components/BottomNavClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Tela de migração exclusiva para a Vercel
  if (process.env.VERCEL === "1") {
    return (
      <html lang="pt-BR" className={`${sora.variable} dark`}>
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          suppressHydrationWarning
          className="antialiased selection:bg-brand-teal selection:text-white h-screen w-screen flex items-center justify-center"
          style={{ fontFamily: "var(--font-sora), sans-serif" }}
        >
          <main className="flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center gap-8">
            <h1 className="font-bold text-6xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-[#1F6663] to-brand-teal-light drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] pb-1">
              WC2026
            </h1>
            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-2xl text-on-surface">Mudamos de casa! 🏠</h2>
              <p className="font-normal text-on-surface-variant leading-relaxed">
                Esta aplicação não está mais hospedada aqui. O projeto oficial foi movido para o
                Netlify. Por favor, acesse nosso novo link para continuar acompanhando a Copa do
                Mundo.
              </p>
            </div>
            <a
              href="https://wcusmxca2026.netlify.app/"
              className="mt-2 flex items-center gap-2 bg-brand-teal text-white px-8 py-4 rounded-full font-bold hover:brightness-110 transition-all animate-bounce"
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
    <html lang="pt-BR" className={`${sora.variable} dark`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased overflow-x-hidden selection:bg-brand-teal selection:text-white"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        <UserProvider>
          {/* TopAppBar (mobile) */}
          <div className="md:hidden">
            <Header />
          </div>

          {/* Modal de Perfil Global */}
          <UserProfileModal />

          {/* Conteúdo + Sidebar Desktop */}
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>

          {/* BottomNav com labels e estilo novo */}
          <BottomNavClient />
        </UserProvider>
      </body>
    </html>
  );
}