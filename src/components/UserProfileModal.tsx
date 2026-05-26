"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

const AVATARS = [
  { id: "eagle", name: "Águia (EUA)", path: "/avatars/eagle.png" },
  { id: "moose", name: "Alce (Canadá)", path: "/avatars/moose.png" },
  { id: "axolotl", name: "Axolote (México)", path: "/avatars/axolotl.png" }
];

export default function UserProfileModal() {
  const { isModalOpen, closeModal, userName, avatarId, saveUserProfile, isSaving } = useUser();
  const [nameInput, setNameInput] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  // Sync state when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setNameInput(userName || "");
      setSelectedAvatar(avatarId);
    }
  }, [isModalOpen, userName, avatarId]);

  if (!isModalOpen) return null;

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    await saveUserProfile(nameInput.trim(), selectedAvatar);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      <div className="bg-surface-container rounded-3xl p-6 md:p-8 max-w-md w-full shadow-elevation-lg border border-outline-variant/30 relative">
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface bg-surface-variant/30 p-2 rounded-full"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col items-center gap-6 mt-2">
          <h3 className="font-headline-md text-on-surface">Seu Perfil</h3>
          
          {/* Avatar Selector */}
          <div className="flex gap-4">
            {AVATARS.map(avatar => (
              <div 
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`cursor-pointer rounded-full p-1 border-4 transition-all ${selectedAvatar === avatar.id ? 'border-primary scale-110 shadow-[0_0_15px_rgba(204,189,255,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={avatar.path} alt={avatar.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover bg-surface-variant" />
              </div>
            ))}
          </div>

          <div className="w-full">
            <label className="text-sm font-label-caps text-on-surface-variant mb-2 block">Seu Nome / Apelido</label>
            <input 
              type="text" 
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 rounded-xl bg-surface-variant border border-outline/50 focus:border-primary outline-none font-body-lg text-on-surface"
            />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={!nameInput.trim() || isSaving}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-caps hover:bg-primary/90 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
          >
            {isSaving ? <span className="material-symbols-outlined animate-spin">sync</span> : "Salvar Perfil"}
          </button>
        </div>
      </div>
    </div>
  );
}
