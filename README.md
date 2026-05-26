# 🏆 Copa do Mundo 2026 - Central de Acompanhamento (Next.js)

Um aplicativo moderno, rápido e super inteligente para acompanhar os jogos, seleções e estádios da Copa do Mundo FIFA de 2026. 

Este documento serve como a **Bíblia do Projeto**. Aqui estão documentadas todas as regras de negócio, a arquitetura de dados e as artimanhas implementadas para garantir que o aplicativo funcione perfeitamente durante a Copa, suportando um alto volume de acessos sem estourar limites de requisições de APIs de terceiros.

---

## 🛠️ Stack de Tecnologias

- **Framework Front-end:** Next.js (React)
- **Estilização:** TailwindCSS (Design System Moderno, com Glassmorphism)
- **Banco de Dados:** Supabase (PostgreSQL)
- **APIs Externas Integradas:**
  - **SportDB / Flashscore:** Fornece o calendário, resultados e tempo real das partidas.
  - **Wikipedia API:** Fornece imagens e história dinâmica de Seleções e Estádios.

---

## 🏗️ Arquitetura e Fluxo de Dados (A Regra de Ouro)

O maior desafio de um portal de esportes em tempo real é a dependência de APIs externas (como a do SportDB), que podem cobrar por chamadas ou possuir limites rígidos. 

Para resolver isso, construímos uma arquitetura de **"Cache Agressivo Dinâmico"**:

### 1. O Repouso Absoluto (Zero Custo)
A "espinha dorsal" do aplicativo (quem vai jogar, que dia e em qual estádio) está salva na tabela `matches` do seu **Supabase**.
- Se faltar **mais de 1 hora** para o início de um jogo, ou se hoje for um dia sem jogos, o aplicativo **NÃO** consulta o SportDB.
- Ele simplesmente pega os dados locais do seu Supabase, renderiza em milissegundos e a carga na API externa é literalmente **ZERO**.

### 2. A Preparação (-1 hora)
- Faltando exatamente 1 hora para o apito inicial de uma partida, a lógica em `src/lib/api.ts` "acorda".
- O servidor faz uma requisição ao SportDB para buscar os dados pré-jogo, como as prováveis escalações.

### 3. Jogo Ao Vivo (Polling)
- Quando o relógio marca o horário do jogo, os componentes do sistema acionam o "Live Mode".
- Apenas para os jogos ativos (status `1H`, `2H`, `HT`, `LIVE`), o aplicativo passa a puxar atualizações do SportDB a cada **15 segundos**, garantindo que gols e cartões apareçam como mágica na tela.

### 4. O Salve Definitivo (Pós-Jogo)
- Assim que o juiz apita o fim de jogo, o SportDB retorna o status `FT` (Full Time), `AET` (Prorrogação) ou `PEN` (Pênaltis).
- Nosso servidor faz uma última requisição **completa**, puxando absolutamente todos os detalhes (posse de bola, escanteios, chutes).
- O aplicativo então executa um comando de **Update e Insert no Supabase**:
  - Salva os gols na tabela `matches`.
  - Troca o status para `FT`.
  - Marca `details_saved = true`.
  - Insere o JSON gigante de estatísticas na tabela `match_details`.
- **Efeito:** A partir desse milionésimo de segundo, este jogo entra em *Repouso Absoluto* para o resto da eternidade. Alguém que acessar esse jogo amanhã, mês que vem ou ano que vem não fará nenhuma requisição à API externa. Tudo sairá do Supabase.

---

## 🧬 Regras de Negócio Importantes

### 1. Fase Eliminatória Mágica ("TBD")
Na fase de mata-mata, os jogos do banco de dados inicialmente não têm times definidos (ex: "Winner of Match 50").
- **A Regra:** Assim que o SportDB soltar a chave correta indicando quais países vão se enfrentar na vida real, o sistema intercepta isso (durante as atualizações automáticas) e corrige o nome (`home_team_name` e `away_team_name`) permanentemente no Supabase. O "Vencedor do Jogo 50" magicamente vira "Brasil", e a bandeira passa a ser exibida automaticamente.

### 2. Textos e Fotos da Wikipedia
- **Problema:** Armazenar imagens pesadas e textos enormes sobre 48 seleções e 16 estádios no Supabase gastaria muito espaço do seu banco de dados e daria trabalho para manter atualizado.
- **A Regra:** Criamos a rota `src/app/api/wikipedia`. Toda vez que um usuário abre a página da Seleção do Brasil ou do Estádio Azteca, o navegador puxa diretamente da Wikipedia o resumo da história ("extract") e a foto oficial ("originalImage"). Custo zero de disco, e conteúdo garantido atualizado para sempre!

### 3. Motor de Tradução
- As APIs gringas mandam "Brazil", "Germany", "Group A".
- O arquivo `src/lib/api.ts` contém um dicionário pesado (`COUNTRY_TRANSLATIONS`) que força a tradução impecável para "Brasil", "Alemanha" e garante que o código do país para buscar as bandeiras (`BRA`, `ALE`) bata com o sistema global.

### 4. Bolão da Copa (Predictor Engine)
- **Desafio:** Implementar um bolão completo, da fase de grupos à final, sem criar um sistema de login (Auth) chato, e calculando as classificações na hora.
- **Solução (Identidade):** O aplicativo gera um `UUID` único no navegador e salva no `localStorage` do usuário. O usuário só insere um "Nome" que fica atrelado ao seu `UUID`. Isso permite dar "F5" à vontade sem perder os dados, armazenados no banco sob a tabela `users`.
- **Solução (Cálculo):** Criamos a lógica em `PredictorLogic.ts` que processa todos os palpites, atualiza pontos, saldo de gols e automaticamente qualifica os top 2 e os melhores 3º lugares para o mata-mata, atualizando a árvore eliminatória em tempo real no cliente!

### 5. Avatares Globais
- Para dar personalidade ao Bolão, usamos Inteligência Artificial para gerar 3 mascotes incríveis representando as sedes (Uma Águia, um Alce e um Axolote).
- Através de um Contexto Global (`UserContext`), o Avatar e o nome escolhidos pelo usuário aparecem fixos no Header em todas as páginas do app.

---

## 🗄️ Tabelas do Supabase (O Coração)

Caso você precise olhar o banco no futuro, aqui está o resumo do que faz o app funcionar:

- `stadiums`: Capacidade, localização, e nome da URL pra puxar da Wikipedia.
- `teams`: Nomes oficiais de quem participa do evento.
- `matches`: A espinha dorsal. Data, times, gols e se os detalhes já foram salvos.
- `match_details`: Tabela filha de `matches`. Guarda um `JSONB` pesadíssimo de estatísticas (eventos minuto-a-minuto) que a gente puxa no fim do jogo para não depender mais da API.
- `users`: (Novo!) Armazena os perfis, nomes e as escolhas de mascote (avatar) de cada usuário.
- `bracket_predictions`: (Novo!) Armazena um arquivo `JSONB` completo com todos os palpites numéricos do Bolão associados ao usuário.

---

## 🚀 Como Executar Localmente

Você precisará de permissões para rodar em sua máquina:

1. Assegure-se de que o arquivo `.env.local` contém:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
   # CRÍTICO: Service Role é usado para salvar os jogos em background!
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_admin_secreta 
   ```
2. Instale os pacotes: `npm install`
3. Rode o ambiente: `npm run dev`
4. Abra [http://localhost:3000](http://localhost:3000)

_Documentação elaborada para não deixar que nenhum detalhe genial de arquitetura deste projeto se perca ao longo do tempo._ 🏆
