# 🏆 Central da Copa do Mundo 2026

Bem-vindo ao repositório oficial da aplicação da **Copa do Mundo 2026**. Este projeto foi desenhado para ser o portal definitivo de acompanhamento do maior evento esportivo do mundo, oferecendo cobertura ao vivo, estatísticas detalhadas, chaveamentos e notícias de última hora.

## 🚀 Tecnologias e Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (com Design System moderno, glassmorphism e animações)
- **Banco de Dados:** Supabase (PostgreSQL)
- **APIs de Terceiros:** SportDB / Flashscore (para placares e estatísticas), Wikipedia (histórico de seleções), APIs de Notícias RSS.

---

## 🏗 Arquitetura do Sistema (Backend-First)

A aplicação foi rigorosamente arquitetada sob o modelo **Backend-First** para garantir a menor latência possível, máxima resiliência e segurança.

### 1. Server Components (SSR) & ISR
Nós banimos a maioria dos \`useEffect\` e chamadas \`fetch\` feitas no lado do cliente. Agora, praticamente todas as páginas são **React Server Components (RSC)**:
- **Zero Loading Spinners:** Os dados são buscados e o HTML é montado no servidor antes de chegar ao usuário, eliminando carregamentos em cascata e "telas em branco".
- **Incremental Static Regeneration (ISR):** As páginas possuem cache dinâmico de curtíssima duração (ex: \`export const revalidate = 60\`). Isso significa que a página é servida no tempo de resposta de um site estático (milisegundos) e atualizada assincronamente nos bastidores.
- **Isolamento de Interatividade:** Apenas as "folhas" da árvore de componentes (ex: botões de abas na página de jogo, barra de pesquisa) usam o \`"use client"\`.

### 2. Fluxo e Caching de Dados (Supabase + APIs Externas)
A regra de negócio prioriza evitar requisições desnecessárias a APIs terceiras:
- **Banco de Dados como Fonte da Verdade:** Todos os jogos base estão na tabela \`matches\` e seus detalhes na tabela \`match_details\`.
- **Estratégia Híbrida Inteligente:** A função principal \`getWorldCupFixtures\` avalia inteligentemente:
  1. Se um jogo já encerrou e foi salvo no Supabase (\`details_saved: true\`), a API externa **nunca mais é chamada** para aquele jogo.
  2. Apenas se o jogo está prestes a começar (menos de 1 hora) ou está ocorrendo (\`LIVE\`), a API de terceiros é acionada em tempo real para obter os placares, substituições, posse de bola e eventos.
  3. Ao detectar que o jogo na API externa mudou o status para \`FT\` (Fim de Jogo), o sistema aciona uma rotina invisível em background que salva todos os eventos e estatísticas definitivamente no Supabase, reduzindo a dependência da API para 0 a partir daquele momento.

---

## 🛡 Segurança e Rate Limiting

A aplicação se protege sozinha! Para evitar ataques DDoS simples, spam ou custos indesejados no Supabase e na infraestrutura:

- Foi implementado um limitador agressivo no **Middleware** (\`src/middleware.ts\`).
- A aplicação impõe um **Rate Limit de 100 requisições por minuto** por endereço de IP em qualquer rota sob \`/api/*\`.
- **Exceções Estratégicas:** A rota \`/api/news\` está isenta do limite, pois ela não afeta o banco de dados e apenas agrega feeds RSS em um forte cache de memória (\`unstable_cache\` do Next.js), mantendo o front-end fluído sem comprometer a segurança.

---

## 🧩 Principais Módulos

### 🏟️ Partidas e Escalações
O coração da aplicação (`/matches` e `/match`). 
Toda a UI muda com base no **estado da partida** ("Não Iniciado", "1H", "Intervalo", "Encerrado"). Quando um jogo fica ao vivo, o status pisca em verde e as estatísticas como "Posse de Bola", "Chutes ao gol" e a "Linha do Tempo de Eventos" entram no ar.

### 🏆 Chaveamento e Fase de Grupos
Acesso em (`/bracket`).
Uma central Server-Side que simula todas as partidas do Supabase para calcular a tabela de grupos em tempo real baseada em Pontos, Saldo de Gols e Gols Pró. Também desenha dinamicamente a árvore do chaveamento eliminatório (Oitavas até a Grande Final).

### 📖 Explorador de Seleções
Acesso em (`/explore/teams/[id]`).
O backend se conecta diretamente aos servidores da **Wikipedia** para baixar o histórico e currículo da seleção, processa os textos, formata em HTML seguro e junta com a lista de todos os jogos que a respectiva equipe tem agendados pelo Supabase.

### 📰 Notícias Agregadas
Na Home e na rota (`/news`).
O `LatestNewsBanner` é um Server Component que processa e unifica diversos feeds RSS do mundo esportivo, fazendo o parse XML e filtrando por termos chave e seleções para manter os fãs completamente antenados, de forma totalmente assíncrona.

---

## 💻 Instalação e Configuração

Para executar este projeto localmente, clone o repositório e configure seu ambiente.

1. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

2. Configure as variáveis de ambiente necessárias em um arquivo \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta_aqui
SPORTDB_API_KEY=sua_api_key_aqui
\`\`\`

3. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

*Nota:* Certifique-se de que o **Netlify/Vercel** seja configurado com a mesma estrutura de váriaveis para o deploy de produção.

---
> *Projeto concebido com as melhores práticas de Next.js, priorizando a estabilidade no servidor e proporcionando a melhor experiência visual ao usuário final.*
