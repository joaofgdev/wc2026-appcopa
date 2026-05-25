"use client";

import { useState, useEffect } from "react";

const WORLD_CUP_DATE = new Date("2026-06-11T15:00:00Z").getTime();

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = WORLD_CUP_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-primary text-white p-4 flex items-center justify-between shadow-elevation-md hover:shadow-elevation-lg transition-all group text-left"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform shrink-0">
            <span className="material-symbols-outlined text-[28px] text-yellow-300">emoji_events</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-label-caps text-white/80 text-xs">Copa do Mundo 2026</span>
            <span className="font-headline-sm font-bold leading-tight">
              Faltam {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors relative z-10 shrink-0 ml-2">
          open_in_full
        </span>
        {/* Decoração de fundo */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </button>

      {/* Modal / Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-surface-container w-full max-w-sm rounded-3xl overflow-hidden shadow-elevation-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header da Modal */}
            <div className="bg-gradient-to-br from-blue-800 to-primary p-8 flex flex-col items-center justify-center text-white relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <span className="material-symbols-outlined text-[64px] text-yellow-300 mb-2 drop-shadow-md">emoji_events</span>
              <h2 className="font-headline-md font-bold text-center">A Maior Copa da História</h2>
            </div>
            
            {/* Corpo da Modal */}
            <div className="p-6 flex flex-col items-center">
              <p className="text-on-surface-variant font-body-md text-center mb-6">
                A contagem regressiva para a Copa do Mundo FIFA 2026™ no Canadá, México e Estados Unidos já começou!
              </p>

              <div className="grid grid-cols-4 gap-2 w-full mb-6">
                <div className="flex flex-col items-center p-2 sm:p-3 bg-surface-container-high rounded-xl">
                  <span className="font-headline-md text-primary font-bold">{timeLeft.days}</span>
                  <span className="text-[10px] font-label-caps text-on-surface-variant uppercase">Dias</span>
                </div>
                <div className="flex flex-col items-center p-2 sm:p-3 bg-surface-container-high rounded-xl">
                  <span className="font-headline-md text-primary font-bold">{timeLeft.hours}</span>
                  <span className="text-[10px] font-label-caps text-on-surface-variant uppercase">Horas</span>
                </div>
                <div className="flex flex-col items-center p-2 sm:p-3 bg-surface-container-high rounded-xl">
                  <span className="font-headline-md text-primary font-bold">{timeLeft.minutes}</span>
                  <span className="text-[10px] font-label-caps text-on-surface-variant uppercase">Min</span>
                </div>
                <div className="flex flex-col items-center p-2 sm:p-3 bg-surface-container-high rounded-xl">
                  <span className="font-headline-md text-primary font-bold">{timeLeft.seconds}</span>
                  <span className="text-[10px] font-label-caps text-on-surface-variant uppercase">Seg</span>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-primary text-on-primary rounded-full font-label-lg hover:bg-primary/90 transition-colors"
              >
                Mal posso esperar!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
