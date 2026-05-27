"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (searchQuery.trim()) router.push(`/matches?q=${encodeURIComponent(searchQuery.trim())}`);
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          borderBottom: `2px solid ${searchFocused ? "#65B1A3" : "rgba(101,177,163,0.35)"}`,
          transition: "border-color 0.2s",
        }}
      >
        <span
          className="material-symbols-outlined shrink-0"
          style={{
            fontSize: "20px",
            color: searchFocused ? "#65B1A3" : "rgba(101,177,163,0.6)",
            transition: "color 0.2s",
          }}
        >
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Pesquise jogos"
          className="flex-1 bg-transparent outline-none border-none"
          style={{
            fontSize: "15px",
            fontWeight: 300,
            color: "#FFFFFF",
            fontFamily: "var(--font-sora), sans-serif",
          }}
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px", color: "rgba(101,177,163,0.6)" }}
            >
              close
            </span>
          </button>
        )}
      </div>
    </form>
  );
}
