"use client";

import { useRef, useEffect, useState } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DraggablePlayer } from "./DraggablePlayer";
import { TacticalPlayer } from "@/types/tactical";

interface Props {
  players: TacticalPlayer[];
  onPlayersChange: (players: TacticalPlayer[]) => void;
}

export function PitchBoard({ players, onPlayersChange }: Props) {
  const pitchRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 0);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    
    if (!pitchRef.current || (delta.x === 0 && delta.y === 0)) return;

    const pitchRect = pitchRef.current.getBoundingClientRect();
    
    // Convert pixel delta to percentage delta
    const deltaXPercent = (delta.x / pitchRect.width) * 100;
    const deltaYPercent = (delta.y / pitchRect.height) * 100;

    onPlayersChange(players.map(p => {
      if (p.id === active.id) {
        // Constrain to 0-100% bounds roughly (minus half a button width)
        return {
          ...p,
          x: Math.max(2, Math.min(98, p.x + deltaXPercent)),
          y: Math.max(2, Math.min(98, p.y + deltaYPercent))
        };
      }
      return p;
    }));
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div 
          ref={pitchRef}
          className="relative w-full aspect-[2/3] sm:aspect-[3/4] rounded-2xl border-4 overflow-hidden shadow-2xl mx-auto transition-all"
          style={{
            background: "linear-gradient(180deg, #1A4027 0%, #163621 100%)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          {/* Stripes */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10%, #000 10%, #000 20%)`
            }}
          />

          {/* Pitch markings */}
          <div className="absolute inset-0 border-[3px] border-white/30 m-3 sm:m-4 rounded-sm pointer-events-none" />
          
          {/* Center line */}
          <div className="absolute top-1/2 left-3 right-3 h-0 border-t-[3px] border-white/30 -translate-y-1/2 pointer-events-none" />
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-28 sm:h-28 border-[3px] border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          {/* Center spot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          {/* Penalty boxes */}
          <div className="absolute top-3 left-1/2 w-36 sm:w-56 h-16 sm:h-20 border-[3px] border-t-0 border-white/30 -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-3 left-1/2 w-36 sm:w-56 h-16 sm:h-20 border-[3px] border-b-0 border-white/30 -translate-x-1/2 pointer-events-none" />

          {/* Goal areas */}
          <div className="absolute top-3 left-1/2 w-16 sm:w-24 h-5 sm:h-7 border-[3px] border-t-0 border-white/30 -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-3 left-1/2 w-16 sm:w-24 h-5 sm:h-7 border-[3px] border-b-0 border-white/30 -translate-x-1/2 pointer-events-none" />

          {/* Penalty spots */}
          <div className="absolute top-14 sm:top-16 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-14 sm:bottom-16 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full -translate-x-1/2 pointer-events-none" />

          {/* Render players */}
          {players.map(player => (
            <DraggablePlayer key={player.id} player={player} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
