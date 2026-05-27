import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Armazenamento em memória para Rate Limiting simples.
// Em Vercel/Serverless, este Map é isolado por instância/lambda. 
// Para rate limit perfeito distribuído, seria ideal usar Redis (ex: Upstash).
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
  // Ignora arquivos estáticos e de sistema do Next
  if (request.nextUrl.pathname.startsWith('/_next') || 
      request.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Ignorar rotas de notícias do rate limit, pois utilizam apenas feeds RSS cacheadados
  if (request.nextUrl.pathname.startsWith('/api/news')) {
    return NextResponse.next();
  }

  // Pega o IP do usuário
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  const limit = 100; // 100 requests
  const windowMs = 60 * 1000; // 1 minuto
  const now = Date.now();

  const rateLimitInfo = rateLimitMap.get(ip);

  if (!rateLimitInfo) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
  } else {
    // Se o minuto já passou, reseta a contagem
    if (now - rateLimitInfo.lastReset > windowMs) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
    } else {
      rateLimitInfo.count++;
      // Bloqueia se ultrapassou as 10 requisições
      if (rateLimitInfo.count > limit) {
        return new NextResponse(
          JSON.stringify({ 
            error: "Muitas requisições. Aguarde um minuto antes de tentar novamente.",
            message: "Too Many Requests" 
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': '60'
            } 
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Aplicamos nas rotas de API para focar onde geralmente ocorrem as mutações/requisições pesadas no DB.
  // Se quiser proteger navegação em páginas também, podemos alterar aqui.
  matcher: [
    '/api/:path*',
  ],
};
