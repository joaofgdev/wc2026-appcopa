"use client";

import { useState, useEffect } from "react";
import GroupTable from "@/components/GroupTable";
import BackButton from "@/components/BackButton";
import KnockoutBracket from "@/components/KnockoutBracket";
import { supabase } from "@/lib/supabase";

export default function BracketPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "knockout">("groups");
  const [groupsData, setGroupsData] = useState<Record<string, any>>({});
  const [knockoutMatches, setKnockoutMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resGroups, { data: matches, error }] = await Promise.all([
          fetch("/api/groups"),
          supabase.from('matches').select('*').neq('round', 'Group Stage').order('match_date')
        ]);
        
        if (resGroups.ok) {
          const data = await resGroups.json();
          setGroupsData(data.standings || {});
        }

        if (matches && !error) {
          // Normalize to match KnockoutBracket component structure
          const formattedMatches = matches.map(m => ({
            id: m.id,
            group: m.group_name,
            round: m.round,
            date: m.match_date,
            homeTeam: m.home_team_name,
            awayTeam: m.away_team_name,
            venue: m.venue_name,
            status: m.status
          }));
          setKnockoutMatches(formattedMatches);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 pt-6 pb-32 md:pb-8 flex flex-col gap-6 min-h-screen">
      {/* Botão Voltar */}
      <div className="pt-2">
        <BackButton />
      </div>

      {/* Título com destaque */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(101,177,163,0.15)",
            border: "1px solid rgba(101,177,163,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "30px",
              color: "#65B1A3",
              fontVariationSettings: "'FILL' 1",
            }}
          >
            emoji_events
          </span>
        </div>
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "var(--font-sora), sans-serif",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Central do Torneio
          </h1>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 300,
              color: "#A8C5C2",
              fontFamily: "var(--font-sora), sans-serif",
              marginTop: "3px",
            }}
          >
            Classificação ao vivo e chave eliminatória.
          </p>
        </div>
      </div>

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