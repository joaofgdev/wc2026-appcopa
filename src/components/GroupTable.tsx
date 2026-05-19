import Image from "next/image";

interface Team {
  name: string;
  flagUrl: string;
  played: number;
  goalDifference: string;
  points: number;
  status?: "advanced" | "eliminated" | "active";
}

interface GroupTableProps {
  groupName: string;
  status: "FINISHED" | "LIVE" | "UPCOMING";
  teams: Team[];
  variant?: "primary" | "secondary" | "neutral";
}

export default function GroupTable({ groupName, status, teams, variant = "neutral" }: GroupTableProps) {
  // Define o brilho de fundo baseado na variante
  const glowMap = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    neutral: "bg-outline-variant/10",
  };
  
  const glowColor = glowMap[variant];

  // Estilização condicional do status do grupo
  const statusStyles = {
    FINISHED: "bg-surface-bright/50 text-on-surface-variant",
    LIVE: "bg-tertiary/10 border border-tertiary/30 text-tertiary neon-glow-tertiary pulse-glow",
    UPCOMING: "bg-surface-bright/50 text-on-surface-variant",
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowColor} rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none`}></div>
      
      <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 z-10">
        <h3 className="font-headline-sm text-on-background">{groupName}</h3>
        <span className={`px-2 py-1 rounded text-xs font-label-caps tracking-wider ${statusStyles[status]}`}>
          {status === "FINISHED" ? "ENCERRADO" : status === "LIVE" ? "AO VIVO" : "EM BREVE"}
        </span>
      </div>

      <div className="flex flex-col gap-2 z-10">
        {/* Cabeçalho da Tabela */}
        <div className="flex items-center text-xs font-label-caps text-on-surface-variant px-2">
          <span className="w-6 text-center">#</span>
          <span className="flex-1 ml-3">TIME</span>
          <div className="flex w-32 justify-between text-right">
            <span className="w-6">J</span>
            <span className="w-6">SG</span>
            <span className="w-8 text-on-background">PTS</span>
          </div>
        </div>

        {/* Lista de Equipas */}
        {teams.map((team, index) => {
          const position = index + 1;
          const isAdvanced = position <= 2; // Simples lógica visual para classificados
          
          return (
            <div 
              key={team.name}
              className={`flex items-center p-2 rounded-lg transition-colors ${
                isAdvanced ? 'bg-tertiary/5 border border-tertiary/20' : 'hover:bg-surface-bright/30 opacity-70'
              }`}
            >
              <span className={`w-6 text-center font-stats-num text-sm ${isAdvanced ? 'text-tertiary' : 'text-on-surface'}`}>
                {position}
              </span>
              <div className="flex-1 ml-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-surface-bright overflow-hidden relative">
                  {/* Substituindo a tag <img> nativa pela otimizada do Next.js */}
                  <img src={team.flagUrl} alt={`${team.name} flag`} className="w-full h-full object-cover" />
                </div>
                <span className={`font-body-md text-sm ${isAdvanced ? 'font-semibold text-on-background' : 'text-on-surface'}`}>
                  {team.name}
                </span>
              </div>
              <div className="flex w-32 justify-between items-center text-right font-stats-num text-sm">
                <span className="w-6 text-on-surface-variant">{team.played}</span>
                <span className="w-6 text-on-surface-variant">{team.goalDifference}</span>
                <span className={`w-8 ${isAdvanced ? 'text-on-background font-bold' : 'text-on-surface font-bold'}`}>
                  {team.points}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}