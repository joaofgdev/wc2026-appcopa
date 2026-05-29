"use client";

import React, { useEffect, useState } from "react";

export default function UpdateNotifier() {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Busca a versão inicial logo que carrega
    const checkVersion = async () => {
      try {
        const res = await fetch("/api/version", { cache: "no-store" });
        const data = await res.json();
        
        if (data.version) {
          setCurrentVersion((prev) => {
            // Se já tínhamos uma versão salva no navegador, 
            // a nova versão recebida não for "dev" (ambiente local) 
            // e for diferente da antiga, temos atualização!
            if (prev && prev !== "dev" && data.version !== "dev" && prev !== data.version) {
              setUpdateAvailable(true);
              return prev; // Mantém a antiga no state para não recarregar em loop caso não recarreguem
            }
            return data.version; // Seta a inicial
          });
        }
      } catch (error) {
        console.error("Erro ao checar versão:", error);
      }
    };

    checkVersion(); // Checa na hora
    
    // Checa automaticamente a cada 1 minuto para não ter delay na experiência
    const interval = setInterval(checkVersion, 60 * 1000);
    
    // Checa imediatamente quando o usuário volta pro app (saiu do navegador e voltou)
    const handleFocus = () => checkVersion();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] bg-primary text-on-primary p-4 shadow-[0_-5px_30px_rgba(101,177,163,0.4)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[28px]">system_update</span>
          <div className="flex flex-col">
            <h4 className="font-bold text-base" style={{ fontFamily: "var(--font-sora), sans-serif" }}>App Atualizado!</h4>
            <p className="text-xs opacity-90 leading-tight">Lançamos uma nova versão do aplicativo com novidades. Por favor, recarregue para aplicar.</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-black/20 hover:bg-black/40 px-6 py-2.5 rounded-full font-bold text-sm transition-colors whitespace-nowrap active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Recarregar
        </button>
      </div>
    </div>
  );
}
