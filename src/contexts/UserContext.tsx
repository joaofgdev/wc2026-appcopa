"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Função para gerar UUID
function generateUUID() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

interface UserContextType {
  userId: string | null;
  userName: string | null;
  avatarId: string;
  isLoading: boolean;
  isSaving: boolean;
  saveUserProfile: (name: string, avatar: string) => Promise<void>;
  deleteUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string>("eagle");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let storedId = localStorage.getItem("predictor_user_id");
    if (!storedId) {
      storedId = generateUUID();
      localStorage.setItem("predictor_user_id", storedId);
    }
    setUserId(storedId);

    async function loadUser() {
      try {
        const res = await fetch(`/api/user?userId=${storedId}`);
        const data = await res.json();
        if (data.user) {
          setUserName(data.user.user_name);
          setAvatarId(data.user.avatar_id);
          localStorage.setItem("predictor_user_name", data.user.user_name);
        } else {
          // Fallback para nome local se existir mas não no DB
          const localName = localStorage.getItem("predictor_user_name");
          if (localName) setUserName(localName);
        }
      } catch (e) {
        console.error("Erro ao carregar usuário:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const saveUserProfile = async (name: string, avatar: string) => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, user_name: name, avatar_id: avatar })
      });
      if (res.ok) {
        setUserName(name);
        setAvatarId(avatar);
        localStorage.setItem("predictor_user_name", name);
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUserProfile = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/user?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        localStorage.removeItem("predictor_user_id");
        localStorage.removeItem("predictor_user_name");
        // Force full reload to wipe all context states (including predictor)
        window.location.href = '/';
      } else {
        alert("Erro ao excluir perfil no servidor");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserContext.Provider value={{
      userId, userName, avatarId, isLoading, isSaving, saveUserProfile, deleteUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
