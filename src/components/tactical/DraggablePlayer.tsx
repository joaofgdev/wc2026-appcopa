"use client";

import { useDraggable } from "@dnd-kit/core";
import { TacticalPlayer } from "@/types/tactical";

interface Props {
  player: TacticalPlayer;
}

export function DraggablePlayer({ player }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: player.id,
    data: {
      type: "Player",
      player
    }
  });

  const combinedTransform = transform
    ? `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px))`
    : "translate(-50%, -50%)";

  const isHome = player.teamType === "home";

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: combinedTransform,
        zIndex: isDragging ? 50 : 10,
        touchAction: 'none' // Important for mobile dragging
      }}
      {...attributes}
      {...listeners}
      className={`w-11 h-11 sm:w-14 sm:h-14 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transition-transform drop-shadow-xl ${
        isDragging ? "scale-125 opacity-90 drop-shadow-2xl" : "hover:scale-110"
      }`}
    >
      <div className="relative w-full h-full pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-full h-full" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))' }}>
          <defs>
            <pattern id={`flag-${player.id}`} patternUnits="objectBoundingBox" width="1" height="1">
              <image href={`https://flagcdn.com/${player.iso2}.svg`} x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
            </pattern>
          </defs>
          <path 
            d="M19.528 5.617C18.665 4.887 18 4.2 16.5 3.5 15 2.8 13.5 2 12 2s-3 .8-4.5 1.5C6 4.2 5.335 4.887 4.472 5.617 3.655 6.307 2 8.35 2 9.5c0 1 .5 2 1 2.5s2 .5 2.5 0L6 11.5V21c0 1 .5 1.5 1.5 1.5h9c1 0 1.5-.5 1.5-1.5v-9.5l.5.5c.5.5 2 .5 2.5 0s1-1.5 1-2.5c0-1.15-1.655-3.193-2.472-3.883z" 
            fill={`url(#flag-${player.id})`}
            stroke={isHome ? "#10B981" : "#F43F5E"}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pt-2">
          <span className="text-[12px] sm:text-[14px] font-black text-white" style={{ textShadow: "0px 1px 3px rgba(0,0,0,0.9), 0px 0px 1px rgba(0,0,0,1)" }}>
            {player.number}
          </span>
        </div>
      </div>
    </div>
  );
}
