"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@/contexts/UserContext";

// Tipo para representar os palpites do usuário
export interface PredictorPicks {
  [matchId: string]: {
    homeScore: number;
    awayScore: number;
    // Em caso de empate no mata-mata, quem avançou nos pênaltis? (1 para home, 2 para away)
    penaltiesWinner?: 1 | 2; 
  };
}

interface PredictorContextType {
  picks: PredictorPicks;
  updatePick: (matchId: string, homeScore: number, awayScore: number, penaltiesWinner?: 1 | 2) => void;
  savePicks: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
  userName: string | null;
  setUserName: (name: string) => void;
}

const PredictorContext = createContext<PredictorContextType | undefined>(undefined);

export function PredictorProvider({ children }: { children: ReactNode }) {
  const { userId, userName: storedName, saveUserProfile, avatarId } = useUser();
  const [picks, setPicks] = useState<PredictorPicks>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados iniciais se existirem
  useEffect(() => {
    if (!userId) return;

    async function loadPicks() {
      try {
        const res = await fetch(`/api/predictor?userId=${userId}`);
        const data = await res.json();
        if (data.predictions && data.predictions.picks) {
          setPicks(data.predictions.picks);
        }
      } catch (e) {
        console.error("Erro ao carregar bolão:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadPicks();
  }, [userId]);

  const updatePick = (matchId: string, homeScore: number, awayScore: number, penaltiesWinner?: 1 | 2) => {
    setPicks(prev => ({
      ...prev,
      [matchId]: { homeScore, awayScore, penaltiesWinner }
    }));
  };

  const savePicks = async () => {
    if (!userId || !storedName) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName: storedName, picks })
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      alert("Bolão salvo com sucesso!");
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar bolão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PredictorContext.Provider value={{
      picks,
      updatePick,
      savePicks,
      isSaving,
      isLoading,
      userName: storedName,
      setUserName: (name: string) => saveUserProfile(name, avatarId)
    }}>
      {children}
    </PredictorContext.Provider>
  );
}

export function usePredictor() {
  const context = useContext(PredictorContext);
  if (!context) throw new Error("usePredictor must be used within PredictorProvider");
  return context;
}
