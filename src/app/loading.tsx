export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Anel de loading ao redor */}
        <div className="absolute inset-[-10px] rounded-[30%] border-[3px] border-surface-variant/50 border-t-primary animate-[spin_2s_linear_infinite]" />
        
        {/* Ícone estático (sem animação, conforme solicitado) */}
        <img 
          src="/logo/icon.svg" 
          alt="WC2026 Logo" 
          className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(101,177,163,0.3)]" 
        />
      </div>
      
      <div className="flex flex-col items-center gap-3 mt-4">
        <h3 className="font-headline-sm font-bold text-xl tracking-wide text-on-background uppercase text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
          Carregando
        </h3>
        
        {/* Pontinhos elegantes pulsando */}
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
