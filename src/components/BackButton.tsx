"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 transition-all active:scale-90 hover:scale-105"
      style={{
        background: "rgba(101,177,163,0.1)",
        border: "1px solid rgba(101,177,163,0.2)",
        borderRadius: "12px",
        padding: "8px 14px",
        color: "#A8C5C2",
        fontFamily: "var(--font-sora), sans-serif",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "0.04em",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
        arrow_back
      </span>
      Voltar
    </button>
  );
}
