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
          className="relative w-full rounded-[20px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "linear-gradient(135deg, #1B3538 0%, #051418 60%, #1F6663 100%)",
            border: "1px solid rgba(101,177,163,0.3)",
            boxShadow: "0 8px 32px rgba(5,20,24,0.5), inset 0 1px 0 rgba(101,177,163,0.15)",
          }}
        >
          {/* Decoração de fundo */}
          <div
            className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #65B1A3, transparent)" }}
          />
          <div
            className="absolute -left-4 -bottom-4 w-32 h-32 rounded-full opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #1F6663, transparent)" }}
          />

          <div className="flex items-center gap-4 z-10">
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
                  fontSize: "28px",
                  color: "#65B1A3",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                emoji_events
              </span>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sora), sans-serif",
                  marginBottom: "2px",
                }}
              >
                Bolão da Copa
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#A8C5C2",
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                Faça seus palpites desde a Fase de Grupos até a Grande Final!
              </p>
            </div>
          </div>

          <button
            className="z-10 px-5 py-2.5 rounded-full font-bold transition-all hover:brightness-110 whitespace-nowrap shrink-0"
            style={{
              background: "#65B1A3",
              color: "#051418",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "var(--font-sora), sans-serif",
              border: "none",
            }}
          >
            {userName ? "Continuar Palpites" : "Começar Meu Bolão"}
          </button>
        </div>
      </section>

      {/* Dialog para inserir nome */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in"
          style={{ background: "rgba(5,20,24,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(145deg, #1B3538 0%, #18141B 100%)",
              border: "1px solid rgba(101,177,163,0.25)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Dialog */}
            <div
              className="p-8 flex flex-col items-center text-center gap-3 relative"
              style={{
                background: "linear-gradient(135deg, rgba(31,102,99,0.3) 0%, transparent 100%)",
                borderBottom: "1px solid rgba(101,177,163,0.15)",
              }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                style={{ background: "rgba(101,177,163,0.1)", color: "#A8C5C2" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                  close
                </span>
              </button>

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(101,177,163,0.15)",
                  border: "1px solid rgba(101,177,163,0.3)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "36px",
                    color: "#65B1A3",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  emoji_events
                </span>
              </div>

              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                Crie seu Bolão
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#A8C5C2",
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                Como você quer ser chamado no placar?
              </p>
            </div>

            {/* Body do Dialog */}
            <div className="p-6 flex flex-col gap-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome ou apelido"
                className="w-full px-4 py-3 rounded-xl outline-none text-center transition-all"
                style={{
                  background: "rgba(101,177,163,0.08)",
                  border: "1px solid rgba(101,177,163,0.25)",
                  color: "#F0EEEF",
                  fontSize: "15px",
                  fontFamily: "var(--font-sora), sans-serif",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(101,177,163,0.6)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(101,177,163,0.25)";
                }}
              />

              <button
                onClick={handleStart}
                disabled={!nameInput.trim()}
                className="w-full py-3 rounded-xl font-bold transition-all disabled:opacity-40"
                style={{
                  background: nameInput.trim()
                    ? "linear-gradient(135deg, #1F6663, #65B1A3)"
                    : "rgba(101,177,163,0.2)",
                  color: "#051418",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "var(--font-sora), sans-serif",
                  border: "none",
                }}
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
