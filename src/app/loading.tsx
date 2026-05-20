export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-bg/90 backdrop-blur-sm">
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        {/* Animated closing circle (Blue) */}
        <div className="absolute inset-0 rounded-full border-[6px] border-brand-surface border-t-brand-blue border-r-brand-blue border-l-brand-blue animate-spin" />
        
        {/* Spinning soccer ball SVG */}
        <div className="animate-[spin_3s_linear_infinite]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 12l3-3-1-4H10l-1 4 3 3z"></path>
            <path d="M15 9l4 2-1 4-4-1-2-5z"></path>
            <path d="M9 9l-4 2 1 4 4-1 2-5z"></path>
            <path d="M12 15l-3 4-1 3h8l-1-3-3-4z"></path>
          </svg>
        </div>
      </div>
      
      <h3 className="text-white font-headline-sm font-bold text-2xl animate-pulse tracking-wide">
        Carregando.....
      </h3>
    </div>
  );
}
