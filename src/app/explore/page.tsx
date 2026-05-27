import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function ExploreMenuPage() {
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
            explore
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
            Explorar a Copa
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
            Conheça tudo sobre a Copa do Mundo 2026
          </p>
        </div>
      </div>

      {/* Cards de navegação */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Seleções */}
        <Link
          href="/explore/teams"
          className="group relative rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            minHeight: "200px",
            background: "linear-gradient(145deg, rgba(31,102,99,0.5) 0%, rgba(27,53,56,0.7) 100%)",
            border: "1px solid rgba(101,177,163,0.25)",
            boxShadow: "0 8px 32px rgba(5,20,24,0.4)",
          }}
        >
          {/* Decoração radial */}
          <div
            className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #65B1A3, transparent)" }}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Ícone no topo */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(101,177,163,0.15)",
                border: "1px solid rgba(101,177,163,0.3)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "26px",
                  color: "#65B1A3",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                flag
              </span>
            </div>

            {/* Texto + seta */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-sora), sans-serif",
                  }}
                >
                  Seleções
                </h3>
                <span
                  className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-2"
                  style={{ fontSize: "24px", color: "#65B1A3" }}
                >
                  arrow_forward
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "#A8C5C2",
                  fontFamily: "var(--font-sora), sans-serif",
                  lineHeight: 1.5,
                }}
              >
                Conheça as 48 seleções classificadas e sua história.
              </p>
            </div>
          </div>
        </Link>

        {/* Estádios */}
        <Link
          href="/explore/stadiums"
          className="group relative rounded-[20px] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            minHeight: "200px",
            background: "linear-gradient(145deg, rgba(5,20,24,0.7) 0%, rgba(27,53,56,0.5) 100%)",
            border: "1px solid rgba(101,177,163,0.2)",
            boxShadow: "0 8px 32px rgba(5,20,24,0.4)",
          }}
        >
          {/* Decoração radial */}
          <div
            className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, #1F6663, transparent)" }}
          />

          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Ícone no topo */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(101,177,163,0.1)",
                border: "1px solid rgba(101,177,163,0.2)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "26px",
                  color: "#A8C5C2",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                stadium
              </span>
            </div>

            {/* Texto + seta */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontFamily: "var(--font-sora), sans-serif",
                  }}
                >
                  Estádios e Sedes
                </h3>
                <span
                  className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-2"
                  style={{ fontSize: "24px", color: "#A8C5C2" }}
                >
                  arrow_forward
                </span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 300,
                  color: "#A8C5C2",
                  fontFamily: "var(--font-sora), sans-serif",
                  lineHeight: 1.5,
                }}
              >
                Descubra os 16 estádios incríveis espalhados pelos 3 países sede.
              </p>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
