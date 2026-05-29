import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Pega o hash do commit ou ID de deploy.
  // Suporte para Netlify (COMMIT_REF, DEPLOY_ID)
  const version = process.env.COMMIT_REF || 
                  process.env.DEPLOY_ID || 
                  process.env.NEXT_PUBLIC_COMMIT_REF || 
                  process.env.VERCEL_GIT_COMMIT_SHA || // Fallback
                  'dev';
                  
  return NextResponse.json({ version });
}
