"use client";

import { useState, useEffect } from "react";

interface CountdownBannerProps {
  targetDate?: string;
  title?: string;
  modalTitle?: string;
  modalDescription?: string;
}

export default function CountdownBanner({
  targetDate = "2026-07-19T15:00:00Z",
  title = "É hora de viver a emoção da copa",
  modalTitle = "Rumo à Grande Final!",
  modalDescription = "Acompanhe cada lance, celebre cada vitória e viva a emoção da Copa do Mundo FIFA 2026™. A grande final está chegando!",
}: CountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const targetTime = new Date(targetDate).getTime();
      const distance = targetTime - now;
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
  }, [targetDate]);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full relative overflow-hidden rounded-2xl p-4 flex items-center justify-between text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "linear-gradient(135deg, #1B3538 0%, #051418 60%, #1F6663 100%)",
          border: "1px solid rgba(101,177,163,0.25)",
          boxShadow: "0 4px 20px rgba(5,20,24,0.4)",
        }}
      >
        {/* Decoração */}
        <div
          className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #65B1A3, transparent)" }}
        />

        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(101,177,163,0.15)",
              border: "1px solid rgba(101,177,163,0.25)",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "24px",
                color: "#65B1A3",
                fontVariationSettings: "'FILL' 1",
              }}
            >
              emoji_events
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span
              style={{
                fontSize: "10px",
                fontWeight: 400,
                color: "#A8C5C2",
                fontFamily: "var(--font-sora), sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {title}
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "var(--font-sora), sans-serif",
                lineHeight: 1.2,
              }}
            >
              Faltam {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </span>
          </div>
        </div>
        <span
          className="material-symbols-outlined relative z-10 shrink-0 ml-2 transition-colors"
          style={{ fontSize: "20px", color: "rgba(101,177,163,0.6)" }}
        >
          open_in_full
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: "rgba(5,20,24,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #1B3538 0%, #18141B 100%)",
              border: "1px solid rgba(101,177,163,0.25)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="p-8 flex flex-col items-center justify-center text-white relative"
              style={{
                background: "linear-gradient(135deg, rgba(31,102,99,0.4) 0%, transparent 100%)",
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
              <span
                className="material-symbols-outlined mb-3"
                style={{
                  fontSize: "56px",
                  color: "#65B1A3",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                emoji_events
              </span>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-sora), sans-serif",
                  textAlign: "center",
                }}
              >
                {modalTitle}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center gap-5">
              <p
                style={{
                  fontSize: "13px",
                  color: "#A8C5C2",
                  fontFamily: "var(--font-sora), sans-serif",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                {modalDescription}
              </p>

              <div className="grid grid-cols-4 gap-2 w-full">
                {[
                  { value: timeLeft.days, label: "Dias" },
                  { value: timeLeft.hours, label: "Horas" },
                  { value: timeLeft.minutes, label: "Min" },
                  { value: timeLeft.seconds, label: "Seg" },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center py-3 px-2 rounded-xl"
                    style={{
                      background: "rgba(101,177,163,0.1)",
                      border: "1px solid rgba(101,177,163,0.18)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#65B1A3",
                        fontFamily: "var(--font-sora), sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#A8C5C2",
                        fontFamily: "var(--font-sora), sans-serif",
                        marginTop: "4px",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 rounded-xl font-bold transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #1F6663, #65B1A3)",
                  color: "#051418",
                  fontSize: "14px",
                  fontWeight: 700,
                  fontFamily: "var(--font-sora), sans-serif",
                  border: "none",
                }}
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
