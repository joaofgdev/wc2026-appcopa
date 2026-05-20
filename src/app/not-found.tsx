import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-bg px-6">
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        {/* Animated circle (Red) */}
        <div className="absolute inset-0 rounded-full border-[6px] border-brand-surface border-t-brand-red border-l-brand-red animate-pulse" />
        
        {/* Broken/Bouncing soccer ball SVG */}
        <div className="animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-red">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 12l3-3-1-4H10l-1 4 3 3z"></path>
            <path d="M15 9l4 2-1 4-4-1-2-5z"></path>
            <path d="M9 9l-4 2 1 4 4-1 2-5z"></path>
            <path d="M12 15l-3 4-1 3h8l-1-3-3-4z"></path>
            <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2"></line>
          </svg>
        </div>
      </div>
      
      <h2 className="text-white font-headline-sm font-bold text-3xl mb-4 text-center">404 - Fora de Jogo!</h2>
      <p className="text-brand-gray-light text-center mb-8 max-w-[280px]">
        Parece que essa página tomou cartão vermelho ou não existe mais.
      </p>
      
      <Link href="/" className="px-8 py-4 bg-brand-blue text-white font-bold rounded-full hover:bg-brand-blue/80 transition-colors shadow-lg active:scale-95">
        Voltar para o campo
      </Link>
    </div>
  );
}
