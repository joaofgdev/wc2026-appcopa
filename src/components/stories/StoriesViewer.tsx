"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface Story {
  id: string;
  type: "countdown" | "video" | "news";
  url?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  duration: number;
  targetDate?: string; // para countdown
}

export interface StoryGroup {
  id: string;
  title: string;
  thumbnail: string;
  stories: Story[];
}

interface StoriesViewerProps {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

export default function StoriesViewer({ groups, initialGroupIndex, onClose }: StoriesViewerProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);

  const currentGroup = groups[currentGroupIndex];
  const currentStory = currentGroup?.stories[currentStoryIndex];

  // Helper de contagem
  const calculateTimeLeft = (dateString: string) => {
    const difference = +new Date(dateString) - +new Date();
    if (difference <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(difference / (1000 * 60 * 60 * 24)),
      h: Math.floor((difference / (1000 * 60 * 60)) % 24),
      m: Math.floor((difference / 1000 / 60) % 60),
      s: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(currentStory?.type === 'countdown' && currentStory.targetDate ? calculateTimeLeft(currentStory.targetDate) : null);

  // Efeito de contagem
  useEffect(() => {
    if (currentStory?.type === 'countdown' && currentStory.targetDate) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(currentStory.targetDate!));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStory]);

  // Efeito de progress bar
  useEffect(() => {
    if (!currentStory) return;
    if (isPaused) return;

    setProgress(0);
    const duration = currentStory.duration || 5000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          handleNext();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => clearInterval(timer);
  }, [currentGroupIndex, currentStoryIndex, isPaused, currentStory]);

  const handleNext = () => {
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose(); // Fim dos stories
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
      setCurrentStoryIndex(groups[currentGroupIndex - 1].stories.length - 1);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    if (clickX < screenWidth / 3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex justify-center overflow-hidden touch-none">
      {/* Container Mobile-size para telas grandes */}
      <div className="relative w-full max-w-md h-full bg-surface-container flex flex-col shadow-2xl">
        
        {/* Camada interativa (toque) */}
        <div 
          className="absolute inset-0 z-40"
          onClick={handleClick}
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
          onPointerLeave={() => setIsPaused(false)}
        ></div>

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 w-full z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex flex-col gap-3 pointer-events-none">
          {/* Barras de Progresso */}
          <div className="flex gap-1">
            {currentGroup.stories.map((s, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{
                    width: idx === currentStoryIndex 
                      ? `${progress}%` 
                      : idx < currentStoryIndex ? '100%' : '0%'
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Info do Grupo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-variant relative">
                {currentGroup.thumbnail && (
                  <Image src={currentGroup.thumbnail} alt={currentGroup.title} fill className="object-cover" />
                )}
              </div>
              <span className="text-white font-bold text-sm drop-shadow-md">{currentGroup.title}</span>
            </div>
            
            {/* Fechar (tem pointer-events-auto pra clicar) */}
            <button 
              onClick={onClose} 
              className="text-white w-8 h-8 flex items-center justify-center bg-black/40 rounded-full pointer-events-auto active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* CONTEÚDO DO STORY */}
        <div className="w-full h-full relative">
          
          {currentStory.type === "countdown" && (
            <div className="w-full h-full bg-gradient-to-br from-brand-blue via-[#1F6663] to-brand-teal flex flex-col items-center justify-center p-6 text-center">
              <span className="material-symbols-outlined text-[80px] text-white/20 mb-4 animate-pulse">public</span>
              <h2 className="text-white font-bold text-4xl mb-2 drop-shadow-lg uppercase tracking-widest">Faltam</h2>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-elevation-lg mb-8">
                <span className="text-white font-black text-8xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] leading-none">
                  {timeLeft?.d || 0}
                </span>
                <span className="block text-white/80 font-bold text-xl uppercase tracking-[0.3em] mt-2">Dias</span>
              </div>
              <p className="text-white/90 font-medium text-lg max-w-[250px] leading-snug">
                Para a maior Copa do Mundo da história!
              </p>
            </div>
          )}

          {currentStory.type === "video" && (
            <div className="w-full h-full bg-black relative flex items-center justify-center">
              {currentStory.imageUrl && (
                <Image src={currentStory.imageUrl} alt={currentStory.title || "Video"} fill className="object-cover opacity-80" />
              )}
              
              {/* Overlay Escuro */}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Ícone de Play Gigante */}
              <a href={currentStory.url} target="_blank" rel="noreferrer" className="z-10 pointer-events-auto flex flex-col items-center gap-4 transition-transform hover:scale-105 active:scale-95 group">
                <div className="w-24 h-24 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_30px_rgba(256,0,0,0.5)] group-hover:bg-red-500">
                  <span className="material-symbols-outlined text-[64px] text-white translate-x-1">play_arrow</span>
                </div>
                <span className="bg-black/60 text-white px-4 py-2 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20 text-sm flex items-center gap-2">
                  Assistir no YouTube <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </span>
              </a>

              <div className="absolute bottom-8 left-4 right-4 z-10 pointer-events-none">
                 <h2 className="text-white font-bold text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight text-center">
                   {currentStory.title}
                 </h2>
              </div>
            </div>
          )}

          {currentStory.type === "news" && (
            <div className="w-full h-full bg-surface-container relative">
              {currentStory.imageUrl ? (
                <Image src={currentStory.imageUrl} alt={currentStory.title || "Notícia"} fill className="object-cover" />
              ) : (
                // Fallback dinâmico se não tiver foto
                <div className="w-full h-full bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[120px] text-white/5 opacity-50 absolute right-[-20px] top-20">article</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-12 left-6 right-6 flex flex-col gap-3">
                <span className="bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-2 py-1 rounded w-max">
                  Últimas Notícias
                </span>
                <h2 className="text-white font-bold text-3xl leading-tight drop-shadow-md">
                  {currentStory.title}
                </h2>
                {currentStory.description && (
                  <p className="text-white/80 text-sm line-clamp-3">
                    {currentStory.description}
                  </p>
                )}
                {currentStory.url && (
                  <a href={currentStory.url} target="_blank" rel="noreferrer" className="mt-4 pointer-events-auto flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-3 rounded-full font-bold justify-center active:scale-95 transition-transform w-full">
                     Ler matéria completa <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
