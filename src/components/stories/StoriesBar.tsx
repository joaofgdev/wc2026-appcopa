"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import StoriesViewer, { StoryGroup } from "./StoriesViewer";

export default function StoriesBar() {
  const [groups, setGroups] = useState<StoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = await res.json();
          setGroups(data.groups || []);
        }
      } catch (err) {
        console.error("Failed to load stories", err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 no-scrollbar w-full animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0">
            <div className="w-[72px] h-[72px] rounded-full bg-surface-variant"></div>
            <div className="h-3 w-16 bg-surface-variant rounded mt-1"></div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) return null;

  return (
    <>
      <div className="w-full">
        <h3 className="font-label-caps text-on-surface-variant px-2 mb-3 mt-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">history_toggle_off</span>
          Stories do Dia
        </h3>
        
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-2 no-scrollbar w-full relative -mx-2 w-[calc(100%+16px)]">
          {groups.map((group, idx) => (
            <button 
              key={group.id}
              onClick={() => setActiveGroupIndex(idx)}
              className="flex flex-col items-center gap-2 shrink-0 group active:scale-95 transition-transform"
            >
              {/* Borda gradiente estilo Instagram */}
              <div className="relative w-[76px] h-[76px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px]">
                <div className="w-full h-full rounded-full border-[3px] border-background overflow-hidden relative bg-surface-variant">
                   {group.thumbnail ? (
                     <Image src={group.thumbnail} alt={group.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <span className="material-symbols-outlined text-3xl mt-4 text-on-surface-variant">smart_display</span>
                   )}
                </div>
              </div>
              <span className="text-xs text-on-surface font-medium truncate w-20 text-center">
                {group.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeGroupIndex !== null && (
        <StoriesViewer 
          groups={groups} 
          initialGroupIndex={activeGroupIndex} 
          onClose={() => setActiveGroupIndex(null)} 
        />
      )}
    </>
  );
}
