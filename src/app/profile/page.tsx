"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import BackButton from "@/components/BackButton";
import { useRouter } from "next/navigation";

const AVATARS = [
  { id: "eagle", name: "Águia (EUA)", path: "/avatars/eagle.png" },
  { id: "moose", name: "Alce (Canadá)", path: "/avatars/moose.png" },
  { id: "axolotl", name: "Axolote (México)", path: "/avatars/axolotl.png" },
  { id: "boy", name: "Menino", path: "/avatars/boy.png" },
  { id: "girl", name: "Menina", path: "/avatars/gril.png" }
];

export default function ProfilePage() {
  const { userName, avatarId, saveUserProfile, isSaving, deleteUserProfile } = useUser();
  const [nameInput, setNameInput] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("eagle");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setNameInput(userName || "");
    setSelectedAvatar(avatarId || "eagle");
  }, [userName, avatarId]);

  const handleSave = async () => {
    if (!nameInput.trim()) return;
    await saveUserProfile(nameInput.trim(), selectedAvatar);
    router.push('/');
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-6 pb-28 flex flex-col gap-8 min-h-screen">
      <div className="pt-2">
        <BackButton />
      </div>

      {/* Título com destaque */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(101,177,163,0.15)",
            border: "1px solid rgba(101,177,163,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "30px",
              color: "#65B1A3",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            person
          </span>
        </div>
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Seu Perfil
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              marginTop: "3px",
            }}
          >
            Gerencie suas informações e avatar
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 mt-4 w-full max-w-md mx-auto">
        
        {/* Avatar Selector */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {AVATARS.map(avatar => (
            <div 
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`cursor-pointer rounded-full p-1 border-4 transition-all ${selectedAvatar === avatar.id ? 'border-primary scale-110 shadow-[0_0_20px_rgba(101,177,163,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={avatar.path} alt={avatar.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover bg-surface-variant" />
            </div>
          ))}
        </div>

        <div className="w-full mt-4">
          <label className="text-sm font-label-caps text-on-surface-variant mb-2 block text-center">Seu Nome / Apelido</label>
          <input 
            type="text" 
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-4 rounded-xl bg-surface-variant border border-outline/50 focus:border-primary outline-none font-body-lg text-on-surface text-center"
          />
        </div>
        
        <button 
          onClick={handleSave}
          disabled={!nameInput.trim() || isSaving}
          className="w-full bg-primary text-on-primary py-4 mt-4 rounded-xl font-label-caps hover:bg-primary/90 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2 text-lg shadow-elevation-md"
        >
          {isSaving ? <span className="material-symbols-outlined animate-spin">sync</span> : "Salvar Perfil"}
        </button>

        {userName && (
          <button 
            onClick={() => setShowDeleteModal(true)}
            disabled={isSaving}
            className="w-full bg-transparent text-error border border-error/50 py-3 mt-2 rounded-xl font-label-caps hover:bg-error/10 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined">delete</span>
            Excluir Meu Perfil
          </button>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-surface-container rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-elevation-lg border border-outline-variant/30 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4 text-error">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="font-headline-sm text-on-surface mb-2">Excluir Perfil?</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Tem certeza que deseja excluir seu perfil? Seus palpites também serão perdidos e você precisará recomeçar.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl font-label-caps bg-surface-variant text-on-surface-variant hover:bg-outline-variant transition-colors"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  await deleteUserProfile();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-3 rounded-xl font-label-caps bg-error text-onError hover:bg-error/90 transition-colors flex justify-center items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? <span className="material-symbols-outlined animate-spin">sync</span> : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
