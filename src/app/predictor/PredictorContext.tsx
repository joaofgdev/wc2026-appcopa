"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@/contexts/UserContext";

// Novo formato dos palpites
export interface PredictorPicks {
  groups: {
    [groupName: string]: {
      1: string | null;
      2: string | null;
      3: string | null;
    }
  };
  bestThirds: string[];
  knockout: {
    [matchId: string]: string | null; // ID da partida -> Nome do time vencedor
  };
}

const initialPicks: PredictorPicks = {
  groups: {},
  bestThirds: [],
  knockout: {},
};

interface PredictorContextType {
  picks: PredictorPicks;
  updateGroupPick: (group: string, position: 1 | 2 | 3, teamName: string | null) => void;
  updateBestThirds: (teams: string[]) => void;
  updateKnockoutPick: (matchId: string, winnerTeamName: string | null) => void;
  savePicks: () => Promise<void>;
  isSaving: boolean;
  isLoading: boolean;
  userName: string | null;
  setUserName: (name: string) => void;
  deletePicks: () => Promise<void>;
}

const PredictorContext = createContext<PredictorContextType | undefined>(undefined);

export function PredictorProvider({ children }: { children: ReactNode }) {
  const { userId, userName: storedName, saveUserProfile, avatarId } = useUser();
  const [picks, setPicks] = useState<PredictorPicks>(initialPicks);
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
          // Garante que a estrutura exista mesmo se o banco tiver lixo
          setPicks({
            groups: data.predictions.picks.groups || {},
            bestThirds: data.predictions.picks.bestThirds || [],
            knockout: data.predictions.picks.knockout || {},
          });
        }
      } catch (e) {
        console.error("Erro ao carregar bolão:", e);
      } finally {
        setIsLoading(false);
      }
    }

    loadPicks();
  }, [userId]);

  const updateGroupPick = (group: string, position: 1 | 2 | 3, teamName: string | null) => {
    setPicks(prev => {
      const groupPicks = prev.groups[group] || { 1: null, 2: null, 3: null };
      
      // Lógica de swap: se o time já estava em outra posição neste grupo, remove de lá
      const newGroupPicks = { ...groupPicks };
      if (teamName) {
        if (newGroupPicks[1] === teamName && position !== 1) newGroupPicks[1] = null;
        if (newGroupPicks[2] === teamName && position !== 2) newGroupPicks[2] = null;
        if (newGroupPicks[3] === teamName && position !== 3) newGroupPicks[3] = null;
      }
      newGroupPicks[position] = teamName;

      return {
        ...prev,
        groups: {
          ...prev.groups,
          [group]: newGroupPicks
        }
      };
    });
  };

  const updateBestThirds = (teams: string[]) => {
    setPicks(prev => ({
      ...prev,
      bestThirds: teams
    }));
  };

  const updateKnockoutPick = (matchId: string, winnerTeamName: string | null) => {
    setPicks(prev => {
      const newKnockout = { ...prev.knockout, [matchId]: winnerTeamName };
      
      // Se eu mudei o vencedor de um jogo anterior, eu preciso limpar o vencedor desse time 
      // dos jogos futuros em que ele estava, para evitar inconsistências. 
      // O modo mais fácil é apenas salvar e a UI cuida da renderização recursiva, 
      // mas podemos querer limpar a árvore inteira pra frente no PredictorLogic depois.
      return {
        ...prev,
        knockout: newKnockout
      };
    });
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

  const deletePicks = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/predictor?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir");
      setPicks(initialPicks);
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir bolão.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PredictorContext.Provider value={{
      picks,
      updateGroupPick,
      updateBestThirds,
      updateKnockoutPick,
      savePicks,
      deletePicks,
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
