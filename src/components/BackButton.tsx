"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-sm mb-6"
    >
      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
      VOLTAR
    </button>
  );
}
