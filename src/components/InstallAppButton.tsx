"use client";

import React, { useEffect, useState } from "react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Checar se é desktop (mesmo o header sendo escondido via CSS, garantimos aqui também)
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    // Checar se o app já está instalado (standalone)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                             ('standalone' in window.navigator && (window.navigator as any).standalone);
    setIsStandalone(!!isStandaloneMode);

    // Detectar iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Escutar o evento de prompt no Android/Chrome
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  if (isStandalone || isDesktop) {
    return null;
  }

  // Se não for iOS e não recebeu o evento de prompt (talvez já instalado ou nav incompatível), não mostra
  if (!isIOS && !deferredPrompt) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="mt-1 flex items-center justify-center gap-1.5 bg-[rgba(101,177,163,0.15)] text-[#65B1A3] border border-[rgba(101,177,163,0.3)] px-3 py-1 rounded-full font-bold text-xs transition-all active:scale-95"
        style={{ fontFamily: "var(--font-sora), sans-serif" }}
      >
        <img src="/logo/icon.svg" alt="App Icon" className="w-4 h-4 object-contain" />
        Instalar App
      </button>

      {/* Modal iOS */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#110F14] rounded-2xl border border-[rgba(101,177,163,0.3)] p-6 max-w-sm w-full flex flex-col gap-4 text-center shadow-[0_0_30px_rgba(101,177,163,0.15)] relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-[#A8C5C2] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            
            <div className="w-16 h-16 mx-auto bg-[rgba(101,177,163,0.15)] rounded-full flex items-center justify-center border border-[rgba(101,177,163,0.3)]">
              <img src="/logo/icon.svg" alt="App Icon" className="w-10 h-10 object-contain" />
            </div>
            
            <h3 className="font-bold text-white text-xl" style={{ fontFamily: "var(--font-sora), sans-serif" }}>Instalar no iOS</h3>
            
            <div className="flex flex-col gap-4 text-sm text-[#A8C5C2] text-left mt-2">
              <p className="flex items-center gap-3 leading-tight">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] text-white font-bold">1</span>
                Toque no ícone de <strong>Compartilhar</strong> na barra do Safari (o quadrado com uma seta apontando para cima).
              </p>
              <p className="flex items-center gap-3 leading-tight">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] text-white font-bold">2</span>
                Role o menu para baixo e toque em <strong>Adicionar à Tela de Início</strong>.
              </p>
              <p className="flex items-center gap-3 leading-tight">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] text-white font-bold">3</span>
                Confirme tocando em <strong>Adicionar</strong> no canto superior direito da tela.
              </p>
            </div>
            
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full py-3 rounded-full bg-[#65B1A3] text-black font-bold hover:brightness-110 transition-all"
              style={{ fontFamily: "var(--font-sora), sans-serif" }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
