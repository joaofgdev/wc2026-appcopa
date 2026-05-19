export default function NewsPage() {
  return (
    <main className="flex-grow pt-24 md:pt-28 pb-24 md:pb-8 px-margin-mobile md:px-margin-desktop overflow-y-auto hide-scrollbar space-y-stack-lg min-h-screen">
      
      {/* Categories Chips */}
      <section className="flex gap-stack-sm overflow-x-auto hide-scrollbar pb-2">
        <button className="flex-shrink-0 bg-primary-container text-on-primary-container font-label-caps text-xs px-4 py-2 rounded-full border border-primary/30 active:scale-95 transition-transform flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
          TODAS
        </button>
        <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant font-label-caps text-xs px-4 py-2 rounded-full border border-outline-variant/30 active:scale-95 transition-transform hover:bg-surface-variant">
          MELHORES MOMENTOS
        </button>
        <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant font-label-caps text-xs px-4 py-2 rounded-full border border-outline-variant/30 active:scale-95 transition-transform hover:bg-surface-variant">
          BASTIDORES
        </button>
        <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant font-label-caps text-xs px-4 py-2 rounded-full border border-outline-variant/30 active:scale-95 transition-transform hover:bg-surface-variant">
          TRANSFERÊNCIAS
        </button>
        <button className="flex-shrink-0 bg-surface-container-high text-on-surface-variant font-label-caps text-xs px-4 py-2 rounded-full border border-outline-variant/30 active:scale-95 transition-transform hover:bg-surface-variant">
          JOGADORES
        </button>
      </section>

      {/* Featured Video (Hero) */}
      <section className="relative w-full h-[530px] md:h-[618px] rounded-xl overflow-hidden glass-card group cursor-pointer active:scale-[0.98] transition-transform duration-300">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent z-10"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBblUtKLTO767yCc9GRj4Slp1LEaVGHtsZ5eqd4jYZ6m33tkU6d-iG1sY7XYpWiQVNn_1HiCWdqY6V5d9cvy2Ujl2sIzuLLBEXUxTztf8LbM4g-iQrRH3Vl1QnXuKpdZLbNcBwYJyeroy36d1tkwMQHe3gJs56pPKoWl0EIBqQI9T-UoarmjPmykuFgiOWpF8_v70mQ2_dYiwdSBO2CBws1EydHhE3fZBdvAa1f7dm3fbUJtdpYb_Mbtqje_KD6yjV9d4QLRTkse8w" 
          alt="Stadium Night Match" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-surface/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 play-button-glow group-hover:bg-primary/40 transition-colors">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-stack-md md:p-stack-lg z-20 flex flex-col gap-unit">
          <div className="flex gap-2 items-center mb-2">
            <span className="bg-error text-on-error font-label-caps px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-bold shadow-[0_0_10px_rgba(255,180,171,0.5)]">LIVE</span>
            <span className="text-on-surface-variant font-label-caps text-[10px]">20 MIN ATRÁS</span>
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-white drop-shadow-md leading-tight">
            Brasil x França: Duelo Épico nas Quartas de Final
          </h2>
          <p className="font-body-md text-on-surface-variant line-clamp-2 md:line-clamp-3 mt-2 max-w-2xl">
            Viva a intensidade do confronto entre dois gigantes do futebol em uma partida repleta de gols dramáticos, polêmicas do VAR e habilidades espetaculares sob os holofotes.
          </p>
        </div>
      </section>

      {/* Match Highlights Horizontal Scroll */}
      <section className="space-y-stack-sm">
        <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">local_fire_department</span> Destaques em Alta
        </h3>
        <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
          
          {/* Highlight Card 1 */}
          <div className="flex-shrink-0 w-[280px] md:w-[320px] rounded-xl overflow-hidden glass-card cursor-pointer group active:scale-[0.98] transition-all">
            <div className="relative h-40">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7JWX4yJKOWa-6Uo_NPYVvOuA4YPbRB4Go4B3sWLGqTyEDSKxKZou-Y_n2nP0V2fTjdFIMPPCc0wKqffDDngnzLkyxTNWw-Eeo_qV2xyBBkafmOsPVLz-ZU8b_DvpCXg33MjdjD-mZNIZ3x-ZdxShHgPaRECX7p8BXXogFBjnAtk4xmJi3GS_4PgF6j9gDWy3FNsyBG6D5aunYi4JCDmQkVakhoFZTgF0vUjddutQwLvlyq1iqPLsrkzn39aAkHxaotrhlJ-3x9_A" alt="Player Highlight" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-2 right-2 bg-surface-container-highest/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-label-caps text-on-surface">04:12</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-primary font-label-caps text-[10px]">FASE DE GRUPOS</span>
                <span className="text-on-surface-variant font-label-caps text-[10px]">2H ATRÁS</span>
              </div>
              <h4 className="font-body-md font-bold text-on-surface line-clamp-2">Golaço de Mbappé Garante Liderança para a França</h4>
            </div>
          </div>

          {/* Highlight Card 2 */}
          <div className="flex-shrink-0 w-[280px] md:w-[320px] rounded-xl overflow-hidden glass-card cursor-pointer group active:scale-[0.98] transition-all">
            <div className="relative h-40">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR8E6SSeSjFRYXcXuMCgOTvxktNnbTnWhLw9VCjNiTkmltXqOopz35ZjLy5IB35GDjead4d1d1IZAMn33aRp0bEJ1ZT0xmH3QllPKqRIduJ9KAaYoEsZwAVvWZLog55vbPCcx7uHf9s4258KLs_yTQTW8zhj9p0V_sJMkDEkQw2N3VzvRMI8udhZlz6rgBej5mA_IABUup82uClpY62gYUwnUTGP01xh6PmZxIxVZ_K0zFTVO7gP97Auj7nlQxaQ-YTNwt0wiYUhc" alt="Penalty Kick" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-2 right-2 bg-surface-container-highest/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-label-caps text-on-surface">02:45</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-tertiary font-label-caps text-[10px]">PÊNALTIS</span>
                <span className="text-on-surface-variant font-label-caps text-[10px]">5H ATRÁS</span>
              </div>
              <h4 className="font-body-md font-bold text-on-surface line-clamp-2">Inglaterra x Alemanha: Drama Completo na Disputa de Pênaltis</h4>
            </div>
          </div>

          {/* Highlight Card 3 */}
          <div className="flex-shrink-0 w-[280px] md:w-[320px] rounded-xl overflow-hidden glass-card cursor-pointer group active:scale-[0.98] transition-all">
            <div className="relative h-40">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAoxRlGHUZDSZxScpgEQ3KPNn7Kf452VhgqBvMWAvEKixJv4ikg8P7uJ5TIz6IUGedNr9gsfkXMg4JkQi63DnPdsvh5rX4GEu1T2wcvJ7xqvv-vS8X5SJPmfrtOFwyc9qyNGVwBnsE0mNtkjytpbHxZGM-JT-UUr9QjI8qNuFjLnvv0lPBxyoed39nfjTNjoHmvbw-suSjScPRBya0-f_QlbrGJ7RsDzhNbdTuo605WOVfKxvZQ7RfkB0iZUNRKt2S5JhaZpdC2gM" alt="Fans" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-2 right-2 bg-surface-container-highest/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-label-caps text-on-surface">01:15</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
              </div>
            </div>
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <span className="text-secondary font-label-caps text-[10px]">TORCIDA</span>
                <span className="text-on-surface-variant font-label-caps text-[10px]">1D ATRÁS</span>
              </div>
              <h4 className="font-body-md font-bold text-on-surface line-clamp-2">A Atmosfera: Dentro do Caos do Estádio Azteca</h4>
            </div>
          </div>

        </div>
      </section>

      {/* News Feed List */}
      <section className="space-y-stack-md">
        <h3 className="font-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">feed</span> Últimos Artigos
        </h3>
        <div className="flex flex-col gap-gutter">
          
          {/* News Item 1 */}
          <article className="flex gap-4 p-4 glass-card rounded-xl cursor-pointer hover:bg-surface-variant/50 transition-colors active:scale-[0.99]">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_ce-uqkq0RDXap2r04APG3vV5r3DXGGeIMGujxwRWFCS3JSmII0A7bsn26QIRIhHbkiBlMQGZCmhDoaqRVd10DGLn_m72ikk2WTX3KsIIgAhRMaYrLVAfR-ONZrf8CIIJNlXWSv6HIg4OeDyaB_rnvCkMykVdfk_jb1fAKYsnitfBkQ3v4SmCLwtoUPYyjAR6GdsLzc0FHrGvsILkVdHHzoMyEAk56XYlUW3P4hYr8_GrOJWlVomTBGEEnBMHSb8ddqCZIAqFA2E" alt="Coach" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-label-caps">TÁTICAS</span>
                  <span className="text-on-surface-variant text-[10px] font-label-caps">3 HORAS ATRÁS</span>
                </div>
                <h4 className="font-body-lg font-bold text-on-surface leading-tight line-clamp-2">Como a Sobrecarga do Meio-Campo da Espanha Desarmou a Defesa Italiana</h4>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[16px]">visibility</span> 12.4K
              </div>
            </div>
          </article>

          {/* News Item 2 */}
          <article className="flex gap-4 p-4 glass-card rounded-xl cursor-pointer hover:bg-surface-variant/50 transition-colors active:scale-[0.99]">
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-lg overflow-hidden relative">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBel0geXmjkzofOCEjP3EaV94Uwq6Tc_tf6nJq7DRC42juMsgMvDWUBFVBhktnGQhyfo2MqZs-6EM1mMaC_0yn76_ttmLDIcSb1seHGEh1MOY73fk9aQ70cBhpRu1mqiRi3DLje5eDWALKEBmdh6xKqrDHRgjXNJR3TNTJa3GC_OJYI8wSaa09NTqpNvD9IXKGuHRRH-QViVq5gha1GuCeuKID8tBvFiyqegwJnLP2HTicGEi3MDbmlPYhphGO8U5ZuvK7rwNAkdM" alt="VAR Whistle" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-error/20 text-error px-2 py-0.5 rounded text-[10px] font-label-caps">ANÁLISE VAR</span>
                  <span className="text-on-surface-variant text-[10px] font-label-caps">5 HORAS ATRÁS</span>
                </div>
                <h4 className="font-body-lg font-bold text-on-surface leading-tight line-clamp-2">O Impedimento Que Mudou o Grupo D: Uma Análise Técnica</h4>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-[16px]">visibility</span> 45.1K
              </div>
            </div>
          </article>

        </div>
      </section>

    </main>
  );
}