"use client";

import { useState } from "react";
import GroupTable from "@/components/GroupTable";
import KnockoutBracket from "@/components/KnockoutBracket";

export default function BracketView({ groupsData, knockoutMatches }: { groupsData: Record<string, any>; knockoutMatches: any[] }) {
  const [activeTab, setActiveTab] = useState<"groups" | "knockout">("groups");

  return (
    <div className="flex flex-col mt-2">
      <section className="flex flex-col mt-2">
        {/* Interactive Tabs */}
        <div 
          className="flex p-1 rounded-[16px] w-full md:w-max"
          style={{
            background: "rgba(27,53,56,0.5)",
            border: "1px solid rgba(101,177,163,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <button 
            onClick={() => setActiveTab("groups")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-[12px] transition-all duration-300 ${activeTab === "groups" ? "shadow-md scale-[1.02]" : "active:scale-[0.98]"}`}
            style={{
              background: activeTab === "groups" ? "rgba(101,177,163,0.2)" : "transparent",
              border: activeTab === "groups" ? "1px solid rgba(101,177,163,0.3)" : "1px solid transparent",
              color: activeTab === "groups" ? "#65B1A3" : "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "12px",
              fontWeight: activeTab === "groups" ? 700 : 500,
              letterSpacing: "0.04em",
            }}
          >
            FASE DE GRUPOS
          </button>
          <button 
            onClick={() => setActiveTab("knockout")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-[12px] transition-all duration-300 ${activeTab === "knockout" ? "shadow-md scale-[1.02]" : "active:scale-[0.98]"}`}
            style={{
              background: activeTab === "knockout" ? "rgba(101,177,163,0.2)" : "transparent",
              border: activeTab === "knockout" ? "1px solid rgba(101,177,163,0.3)" : "1px solid transparent",
              color: activeTab === "knockout" ? "#65B1A3" : "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              fontSize: "12px",
              fontWeight: activeTab === "knockout" ? 700 : 500,
              letterSpacing: "0.04em",
            }}
          >
            FASE ELIMINATÓRIA
          </button>
        </div>
      </section>

      {/* Renderização Condicional do Conteúdo */}
      
      {/* View: Group Stage */}
      {activeTab === "groups" && (
        <section className="animate-fade-in block mt-4">
          {Object.keys(groupsData).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
              {Object.entries(groupsData).map(([groupName, teams], index) => {
                const variants = ["primary", "secondary", "neutral"];
                const variant = variants[index % variants.length] as any;
                const hasPoints = teams.some((t: any) => t.played > 0);
                const status = hasPoints ? "LIVE" : "UPCOMING";
                
                return (
                  <GroupTable 
                    key={groupName} 
                    groupName={groupName} 
                    status={status} 
                    teams={teams} 
                    variant={variant} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] opacity-40">table_rows_narrow</span>
              <p className="font-body-md text-center">Nenhum grupo disponível.</p>
            </div>
          )}
        </section>
      )}

      {/* View: Knockout Stage */}
      {activeTab === "knockout" && (
        <section className="animate-fade-in block mt-4">
          <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-2 md:p-6 shadow-elevation-md">
            <div className="mb-4">
              <h3 className="font-headline-md text-on-surface">Caminho para a Glória</h3>
              <p className="font-body-md text-on-surface-variant">Arraste para o lado para ver todas as fases até a Grande Final.</p>
            </div>
            
            <KnockoutBracket matches={knockoutMatches} />
          </div>
        </section>
      )}
    </div>
  );
}
