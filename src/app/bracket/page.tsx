"use client";

import { useState } from "react";
import GroupTable from "@/components/GroupTable";
import BackButton from "@/components/BackButton";

import { useEffect } from "react";
import KnockoutBracket from "@/components/KnockoutBracket";
import worldcupData from "@/data/worldcup.json";

// Extrair apenas os jogos das eliminatórias
const knockoutMatches = worldcupData.matches.filter(m => m.round !== "Group Stage") as any[];

export default function BracketPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "knockout">("groups");
  const [groupsData, setGroupsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch("/api/groups");
        if (res.ok) {
          const data = await res.json();
          setGroupsData(data.standings || {});
        }
      } catch (err) {
        console.error("Erro ao carregar classificação:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      <div>
        <BackButton />
      </div>
      {/* Header & Tabs */}
      <section className="flex flex-col gap-stack-md mt-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Central do Torneio</h2>
            <p className="font-body-md text-on-surface-variant mt-1">Classificação ao vivo e chave eliminatória.</p>
          </div>
        </div>

        {/* Interactive Tabs */}
        <div className="flex p-1 bg-surface-container-high/50 backdrop-blur-md rounded-xl border border-outline-variant/20 w-full md:w-max mt-2">
          <button 
            onClick={() => setActiveTab("groups")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-label-caps transition-all duration-300 ${
              activeTab === "groups" 
                ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(204,189,255,0.2)]" 
                : "text-on-surface-variant hover:text-on-background border border-transparent"
            }`}
          >
            FASE DE GRUPOS
          </button>
          <button 
            onClick={() => setActiveTab("knockout")}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg font-label-caps transition-all duration-300 ${
              activeTab === "knockout" 
                ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(204,189,255,0.2)]" 
                : "text-on-surface-variant hover:text-on-background border border-transparent"
            }`}
          >
            FASE ELIMINATÓRIA
          </button>
        </div>
      </section>

      {/* Renderização Condicional do Conteúdo */}
      
      {/* View: Group Stage */}
      {activeTab === "groups" && (
        <section className="animate-fade-in block">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-xl bg-surface-variant/20 animate-pulse"></div>
              ))}
            </div>
          ) : Object.keys(groupsData).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
              {Object.entries(groupsData).map(([groupName, teams], index) => {
                const variants = ["primary", "secondary", "neutral"];
                const variant = variants[index % variants.length] as any;
                // Como não iniciou ainda, podemos usar UPCOMING. Se tiver pontos, usamos LIVE
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

    </main>
  );
}