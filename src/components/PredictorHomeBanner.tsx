"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function PredictorHomeBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const { userName, saveUserProfile } = useUser();
  const [nameInput, setNameInput] = useState("");
  const router = useRouter();

  const handleOpen = () => {
    if (userName) {
      router.push("/predictor");
    } else {
      setIsOpen(true);
    }
  };

  const handleStart = () => {
    if (nameInput.trim()) {
      saveUserProfile(nameInput.trim(), "eagle");
      setIsOpen(false);
      router.push("/predictor");
    }
  };

  return (
    <>
      <section className="w-full">
        <div 
          onClick={handleOpen}
          className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant/30 shadow-[0_0_20px_rgba(204,189,255,0.2)] cursor-pointer hover:brightness-110 transition-all"
        >
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[48px] text-white drop-shadow-md">sports_esports</span>
            <div>
              <h3 className="font-headline-md text-white">Bolão da Copa</h3>
              <p className="font-body-sm text-white/90">Faça seus palpites desde a Fase de Grupos até a Grande Final!</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white text-primary font-label-caps rounded-full hover:scale-105 transition-transform shadow-elevation-md whitespace-nowrap">
            {userName ? "Continuar Palpites" : "Começar Meu Bolão"}
          </button>
        </div>
      </section>

      {/* Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-surface-container rounded-2xl p-8 max-w-md w-full shadow-elevation-lg animate-fade-in border border-outline-variant/30 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <span className="material-symbols-outlined text-[48px] text-primary">emoji_events</span>
              <h3 className="font-headline-md text-on-surface">Crie seu Bolão</h3>
              <p className="font-body-md text-on-surface-variant">Como você quer ser chamado no placar?</p>
              
              <input 
                type="text" 
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Seu nome ou apelido"
                className="w-full mt-4 px-4 py-3 rounded-lg bg-surface-variant border border-outline/50 focus:border-primary outline-none font-body-lg text-on-surface text-center"
              />
              
              <button 
                onClick={handleStart}
                disabled={!nameInput.trim()}
                className="w-full mt-2 bg-primary text-on-primary py-3 rounded-lg font-label-caps hover:bg-primary/90 disabled:opacity-50 transition-opacity"
              >
                Avançar para os Jogos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
