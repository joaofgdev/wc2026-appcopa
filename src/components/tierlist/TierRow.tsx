"use client";

import { useDroppable } from "@dnd-kit/core";
import { DraggableFlag } from "./DraggableFlag";
import { TeamItem } from "@/types/tierlist";

interface TierRowProps {
  id: string;
  title: string;
  colorClass: string;
  items: TeamItem[];
  onFlagClick?: (team: TeamItem) => void;
}

export function TierRow({ id, title, colorClass, items, onFlagClick }: TierRowProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`flex bg-slate-800/50 rounded-xl overflow-hidden mb-4 border transition-colors ${isOver ? 'border-primary bg-slate-800/80' : 'border-slate-700/50'} shadow-lg`}>
      {/* Label da Prateleira */}
      <div className={`w-28 sm:w-36 flex items-center justify-center p-3 font-bold text-center text-sm sm:text-base text-slate-900 shrink-0 ${colorClass}`}>
        {title}
      </div>
      
      {/* Área onde as bandeiras ficam */}
      <div 
        ref={setNodeRef} 
        className="flex-1 p-3 min-h-[80px] sm:min-h-[96px] flex flex-wrap gap-2 sm:gap-3 items-center"
      >
        {items.map(team => (
          <DraggableFlag key={team.id} team={team} onClick={() => onFlagClick?.(team)} />
        ))}
      </div>
    </div>
  );
}
