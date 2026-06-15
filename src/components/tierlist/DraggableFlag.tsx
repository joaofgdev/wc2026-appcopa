"use client";

import { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TeamItem } from "@/types/tierlist";

export function DraggableFlag({ team, onClick }: { team: TeamItem; onClick?: () => void }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: team.id,
    data: {
      type: "Team",
      team,
    },
    disabled: isMobile,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 999 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isDragging && onClick) onClick();
      }}
      className={`relative group cursor-grab active:cursor-grabbing w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-transform duration-100 ${
        isDragging ? "border-primary shadow-2xl scale-110" : "border-slate-600 hover:border-primary hover:scale-105"
      }`}
      title={team.name}
    >
      <img 
        src={`https://flagcdn.com/${team.iso2}.svg`} 
        alt={team.name}
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}
