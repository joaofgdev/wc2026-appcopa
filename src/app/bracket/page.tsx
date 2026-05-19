"use client";

import { useState } from "react";
import GroupTable from "@/components/GroupTable";
import BackButton from "@/components/BackButton";

import { useEffect } from "react";

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

      {/* View: Knockout Phase */}
      {activeTab === "knockout" && (
        <section className="animate-fade-in">
          <div className="w-full overflow-x-auto no-scrollbar pb-8">
            <div className="flex gap-12 min-w-max items-center py-8">
              
              {/* Round of 16 */}
              <div className="flex flex-col gap-6">
                <h4 className="font-label-caps text-on-surface-variant mb-2">OITAVAS DE FINAL</h4>
                
                {/* Match Block */}
                <div className="glass-panel rounded-xl w-64 border border-outline-variant/20 overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-2 bg-surface-container-highest/50 border-b border-outline-variant/10 text-xs font-label-caps text-on-surface-variant">
                    <span>Jogo 49</span>
                    <span>2 Jul</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-outline-variant/10 hover:bg-surface-bright/30">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-bright overflow-hidden">
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdDOoXecAO9PTM12OWF6VXmw_AucxO94rWQZia2nnics6yl5pbOAWrvtPiQukcPvS7VA6df4jxBTFOjxD_RYkS27Rszb07FlQKZeQdNfbUrmvRcNjP9WWAd5BrDMR2Zt851wXtoS-E63HCHppCnsltRRzce5YQi-6C5LgeEo48fkrBQSDH5J_uVO55SYi8PV7NHtQ7xOeXMapamAsdpVaHD8HKnIz6vBDMmzV1H2RipVAztSrVXFaAlSy_o5rAXrGDEh9QQG8CaKE" alt="HOL" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm font-semibold text-on-background">HOL</span>
                      </div>
                      <span className="font-stats-num text-sm font-bold text-on-background">3</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-surface-bright/30 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-bright overflow-hidden">
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqyJiup2Na4K5Fn94Pc86GOMj2hgqnjJHfIzo-PvLZGyVQ5vtzEXm8QzXgpKPxwnMq4IqwD5htXB1jBHgXIIgArOGmUxddJFzoRaiHfAqc_6mvVuSpYv9jGnddwEfXnnX6WyA8nYP07SOkjVA3HIBRjl05iAGmpNuMDCYV_zuunm-U1GNFZWxbleSy2JMYf9ZZBkjjdyUTpnLzpZ5hckbvF0yivDMTmXVokTcU_bhrOvwibStZ9X1wwHifTc-DYed_4TYRvTg4rQk" alt="EUA" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm text-on-background">EUA</span>
                      </div>
                      <span className="font-stats-num text-sm text-on-background">1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quarter Finals */}
              <div className="flex flex-col gap-6">
                <h4 className="font-label-caps text-on-surface-variant mb-2">QUARTAS DE FINAL</h4>
                <div className="glass-panel rounded-xl w-64 border border-primary/30 neon-glow-primary overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
                  <div className="flex justify-between items-center px-4 py-2 bg-surface-container-highest/50 border-b border-outline-variant/10 text-xs font-label-caps text-primary">
                    <span>Jogo 57</span>
                    <span>9 Jul • EM BREVE</span>
                  </div>
                  <div className="flex flex-col relative z-10">
                    <div className="flex justify-between items-center px-4 py-3 border-b border-outline-variant/10 hover:bg-surface-bright/30">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-bright overflow-hidden">
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJkwi2sAjGPgS6gHg-uIuzwKOhmZYUd0cnwOMtgkrz_HRopfsP_Uxpp5HkOTNZboV_MI1Gtp_iAGdE3Ued152Ptqy2zuDmhrfaBxGuwCf1SC01-26gHl0LhGdkhts6dxPbxEq4Q5VEuA4nRI-85RAheK0qSieuslbpg-0WGocwTeJ5k9bb0GC9AgowtVIngQ5un6j0OoyS3IR-NqgRIx0R3ESPl-9CIuZNIY53e-WjpYTXANs-JPmS-Y8mnrLhUHbC9qVfJnLGHyg" alt="HOL" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm font-semibold text-on-background">HOL</span>
                      </div>
                      <span className="font-stats-num text-sm text-on-surface-variant">-</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-surface-bright/30">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-bright overflow-hidden">
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAszKQyXL0KPIVNVpmRpQ-BnZE1aRytc0GUDmn62uSlP6kKKBbhEQTp98IjHt0T2sM5DLZ_bczC_T457Tw6dqDqv6-kixxxks1vVYK9DgGwS_5IFwPPt3VuTqOjhFQgFXuaoaeeCdRbWX2r9kO7M6KkZq_qQkNxUNLC_Q-hgWsPKtovDROjl0VanuCEVtt6lTqQHkIPmLfAukC6rjlhhGgIo_r8pooJB8QI8Mus4hJnBEPv1PPpldxgdY3xJLU8ma4tk0s0Qi6rdv8" alt="ARG" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm font-semibold text-on-background">ARG</span>
                      </div>
                      <span className="font-stats-num text-sm text-on-surface-variant">-</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

    </main>
  );
}