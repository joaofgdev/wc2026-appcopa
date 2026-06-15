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
        // Constrain horizontally, but allow vertically to go down to the bench area
        return {
          ...p,
          x: Math.max(2, Math.min(98, p.x + deltaXPercent)),
          y: Math.max(2, Math.min(130, p.y + deltaYPercent))
        };
      }
      return p;
    }));
  };

  if (!isMounted) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="relative w-full">
          {/* Pitch Area */}
          <div 
            ref={pitchRef}
            className="relative w-full aspect-[2/3] sm:aspect-[3/4] rounded-2xl border-4 shadow-2xl mx-auto transition-all"
            style={{
              background: "linear-gradient(180deg, #1A4027 0%, #163621 100%)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            {/* The background items that need overflow-hidden */}
            <div className="absolute inset-0 rounded-[11px] overflow-hidden pointer-events-none">
              {/* Stripes */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10%, #000 10%, #000 20%)`
                }}
              />

              {/* Pitch markings */}
              <div className="absolute inset-0 border-[3px] border-white/30 m-3 sm:m-4 rounded-sm" />
              
              {/* Center line */}
              <div className="absolute top-1/2 left-3 right-3 h-0 border-t-[3px] border-white/30 -translate-y-1/2" />
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 w-20 h-20 sm:w-28 sm:h-28 border-[3px] border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
              
              {/* Center spot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
              
              {/* Penalty boxes */}
              <div className="absolute top-3 left-1/2 w-36 sm:w-56 h-16 sm:h-20 border-[3px] border-t-0 border-white/30 -translate-x-1/2" />
              <div className="absolute bottom-3 left-1/2 w-36 sm:w-56 h-16 sm:h-20 border-[3px] border-b-0 border-white/30 -translate-x-1/2" />

              {/* Goal areas */}
              <div className="absolute top-3 left-1/2 w-16 sm:w-24 h-5 sm:h-7 border-[3px] border-t-0 border-white/30 -translate-x-1/2" />
              <div className="absolute bottom-3 left-1/2 w-16 sm:w-24 h-5 sm:h-7 border-[3px] border-b-0 border-white/30 -translate-x-1/2" />

              {/* Penalty spots */}
              <div className="absolute top-14 sm:top-16 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full -translate-x-1/2" />
              <div className="absolute bottom-14 sm:bottom-16 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full -translate-x-1/2" />
            </div>

            {/* Render players outside the overflow-hidden div so they can go to the bench */}
            {players.map(player => (
              <DraggablePlayer key={player.id} player={player} />
            ))}
          </div>

          {/* Bench Area Placeholder below the pitch */}
          <div className="mt-6 w-full h-24 sm:h-32 rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center bg-surface-container/30 backdrop-blur-sm pointer-events-none">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30 mb-2">groups</span>
            <span className="text-on-surface-variant/50 font-label-caps tracking-widest uppercase text-xs sm:text-sm">Banco de Reservas</span>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
