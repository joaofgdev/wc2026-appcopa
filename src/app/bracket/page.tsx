"use client";

import { useState } from "react";
import GroupTable from "@/components/GroupTable";

// Dados simulados para testarmos o design
const groupA_Data = [
  { name: "BRA", flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA87P4JsmrLd7jycfrwUNT5ne_tvmS_5AcMfVZza-9KPdyEhrIDonNzE1EtX2NDOjY7K6XuBKkdU6RITNkR2i98N1KR8SF9yYiVSlogwwvnZ7V6odNpYZXJC7U4UunCdT9wvqjaAT94OC0FtZwFAUINT3Ihw-okRbROxlBxCBjbD5gJ5GtO1IR80lECavgyuOUFOmUXj8KdQLqLxU_1LaXtRvvkBqBbIc3bwaDhiGHc0Q2JPTQED3C7eTi7K0zd855pcaEt5vdu4Hc", played: 3, goalDifference: "+5", points: 9 },
  { name: "SUI", flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD69_zxARn72VJyHD7bQVO595fUnuk5JRsyn62nPDdVLnoWGAJhzEg8rSjOvv-CED2uQD3DDJv5PDAlUFB01FDF2_qrQpfFVr3zpQMZyVWd7EbziFtEbgndlqN4Pvs2s3wPyMe-lGUhkzl-4aZepNtVylHuyYYI9ZKyk969WkZJW1sHDt90ypISwbJ84oZ5bGn1BtZ2OEGfWyatokjPlCQ491E6oUKT3CJpCzHEyK3jMhQ9FG6BEr-CbArUZrvTMUfpHjPCqZr0uYk", played: 3, goalDifference: "+1", points: 6 },
  { name: "CMR", flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtz8BxnAo5ORI-kJ0YT9kWVOXTgr_RRu0SiqgQ_EqmKb72gMaSeXxlm9Jpt7e7vtp_t7ryLzVNeXDgdInor01hdf-qPOziJGEYgkDkHQLhWEF_--YyenoSmfUCwkVv5bou7fkMz5iKpJCVuEHzFSz3ErcI64U_mQmAo1sOvz2Frz_JP4k4RjSWWfdhYIUSbqgQz-8i6bDhq6yXYGI7l3iKt7R-ORXjnKF8wRvz88n4NxQORIL4Y5yEbiEA4Px_FCxyk1IKPjPR0uo", played: 3, goalDifference: "-2", points: 3 },
];

const groupB_Data = [
  { name: "ENG", flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8XpLpwciKQc4VaMiRxCj3NzwH-lIAp3sH32kKxSQ_O1lqsXORREiZ0wmSGuaP0BBABuoFTcUsu8nw_boc00CBVY4hLOb4H4R-Cj3-7948oehOuQxjpxuX7faYpvlwybp2qy9i6HbDPPRiD8h1oSAPbXnaSD0DWIf8iLx6vuz2GT3eAUwa4pU0pDGxOiGkpiNHoPsBJFcUaqZ4J4u1sHnZqnRNKkEoXE8EVWHPyce56cG8f-Ds8WxzzsgW5yNf_EkKjKD0twvwhTA", played: 2, goalDifference: "+4", points: 6 },
  { name: "USA", flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkKKW96--59SAogANh-lK5ZyesscjEsqjsiNmQ7ChbDMRJXbf-iF293IP_NTL2v6DYORbwWv57wXqvfYMdkiE50bWE9_tGSPr2rOCZ8siV34h3ILPZAFEld4L9ic_xQa-U48-7CW-Sbasl1KWGJEu9smmxU1GE__R6B0LHQJJEhV_2t0LVULdVawt9x6QFNQF-ybT0Wgabw_X6T8Awkdpp6UUrA4GuEyTJ2IYeD-QftnVRegAwMJKdGPDJo4xvUm2JWZC3ABp4_t4", played: 2, goalDifference: "0", points: 4 },
];

export default function BracketPage() {
  const [activeTab, setActiveTab] = useState<"groups" | "knockout">("groups");

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-20 pb-28 md:pb-8 flex flex-col gap-stack-lg min-h-screen">
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
            <GroupTable groupName="Grupo A" status="FINISHED" teams={groupA_Data} variant="secondary" />
            <GroupTable groupName="Grupo B" status="LIVE" teams={groupB_Data} variant="primary" />
            {/* Você pode adicionar os outros grupos aqui depois */}
          </div>
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
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdDOoXecAO9PTM12OWF6VXmw_AucxO94rWQZia2nnics6yl5pbOAWrvtPiQukcPvS7VA6df4jxBTFOjxD_RYkS27Rszb07FlQKZeQdNfbUrmvRcNjP9WWAd5BrDMR2Zt851wXtoS-E63HCHppCnsltRRzce5YQi-6C5LgeEo48fkrBQSDH5J_uVO55SYi8PV7NHtQ7xOeXMapamAsdpVaHD8HKnIz6vBDMmzV1H2RipVAztSrVXFaAlSy_o5rAXrGDEh9QQG8CaKE" alt="NED" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm font-semibold text-on-background">NED</span>
                      </div>
                      <span className="font-stats-num text-sm font-bold text-on-background">3</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-surface-bright/30 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-surface-bright overflow-hidden">
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqyJiup2Na4K5Fn94Pc86GOMj2hgqnjJHfIzo-PvLZGyVQ5vtzEXm8QzXgpKPxwnMq4IqwD5htXB1jBHgXIIgArOGmUxddJFzoRaiHfAqc_6mvVuSpYv9jGnddwEfXnnX6WyA8nYP07SOkjVA3HIBRjl05iAGmpNuMDCYV_zuunm-U1GNFZWxbleSy2JMYf9ZZBkjjdyUTpnLzpZ5hckbvF0yivDMTmXVokTcU_bhrOvwibStZ9X1wwHifTc-DYed_4TYRvTg4rQk" alt="USA" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm text-on-background">USA</span>
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
                           <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJkwi2sAjGPgS6gHg-uIuzwKOhmZYUd0cnwOMtgkrz_HRopfsP_Uxpp5HkOTNZboV_MI1Gtp_iAGdE3Ued152Ptqy2zuDmhrfaBxGuwCf1SC01-26gHl0LhGdkhts6dxPbxEq4Q5VEuA4nRI-85RAheK0qSieuslbpg-0WGocwTeJ5k9bb0GC9AgowtVIngQ5un6j0OoyS3IR-NqgRIx0R3ESPl-9CIuZNIY53e-WjpYTXANs-JPmS-Y8mnrLhUHbC9qVfJnLGHyg" alt="NED" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-body-md text-sm font-semibold text-on-background">NED</span>
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