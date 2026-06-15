"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePredictorUser } from "@/hooks/usePredictorUser";
import { AlbumInventory } from "@/types/album";

interface AlbumContextProps {
  inventory: AlbumInventory;
  lastOpenedAt: string | null;
  isLoading: boolean;
  openPack: () => Promise<string[]>; // Retorna IDs das figurinhas
  refresh: () => Promise<void>;
}

const AlbumContext = createContext<AlbumContextProps>({
  inventory: {},
  lastOpenedAt: null,
  isLoading: true,
  openPack: async () => [],
  refresh: async () => {},
});

export function AlbumProvider({ children }: { children: React.ReactNode }) {
  const { userId } = usePredictorUser();
  const [inventory, setInventory] = useState<AlbumInventory>({});
  const [lastOpenedAt, setLastOpenedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/album?userId=${userId}`);
      const data = await res.json();
      if (data.inventory) setInventory(data.inventory);
      if (data.lastOpenedAt !== undefined) setLastOpenedAt(data.lastOpenedAt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  const openPack = async () => {
    if (!userId) return [];
    setIsLoading(true);
    try {
      // Usar forceOpen=true por enquanto para permitir testes e brincadeiras sem travar em 20h
      const res = await fetch("/api/album/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, forceOpen: false }) 
      });
      const data = await res.json();
      if (data.success) {
        await refresh(); // atualiza o inventário com os novos itens
        return data.pulledStickers;
      } else {
        alert("Erro: " + (data.error || "Tente novamente mais tarde."));
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlbumContext.Provider value={{ inventory, lastOpenedAt, isLoading, openPack, refresh }}>
      {children}
    </AlbumContext.Provider>
  );
}

export const useAlbum = () => useContext(AlbumContext);
