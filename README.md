# DevQuest ☕🐹

Plataforma gamificada para aprender **Java** e **Golang** — da sintaxe ao System Design — com teoria, exemplos, práticas **corrigidas automaticamente** (o código roda de verdade), histórico salvo, login por **magic link** e gamificação (XP, níveis, ofensiva diária e conquistas).

Trilhas incluídas:

- **☕ Java** — os 17 degraus: Fundamentos, OOP, Collections, Exceções, Multithreading, JDBC, SQL, Spring Core, Spring Boot, REST APIs, JPA/Hibernate, Microsserviços, Kafka, Docker, Kubernetes, Cloud e System Design.
- **🐹 Golang** — fundamentos, structs, interfaces, concorrência, serviços HTTP e testes.
- **🗣️ Inglês para Devs** — vocabulário, documentação, PRs e entrevistas.
- **🛠️ Backend (Fundamentos)** — HTTP/REST, autenticação, modelagem de dados, cache e performance.
- **🤖 IA para Desenvolvimento** — como usar IA no dia a dia com responsabilidade.

Stack: **Next.js 15** (App Router) · **Supabase** (Auth + Postgres) · execução de código via **Piston** · **Tailwind CSS** · **TypeScript**.

---

## 1. Pré-requisitos

- **Node.js 18.18+** (ideal 20+).
- Uma conta no **Supabase** (gratuita) — https://supabase.com
- Uma conta na **Vercel** (gratuita) — https://vercel.com

## 2. Configurar o Supabase

1. Crie um projeto novo no Supabase.
2. No menu **SQL Editor**, cole e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Isso cria a tabela `user_progress` com **RLS** (cada usuário só acessa o próprio progresso).
3. Em **Project Settings → API**, copie:
   - **Project URL** → vira `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → vira `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Usamos apenas a chave **anon** (pública) + RLS. **Não** há service-role key no projeto — menos superfície de risco.

### 2.1 Ativar o login por magic link

1. Em **Authentication → Providers → Email**, deixe o e-mail habilitado (padrão).
2. Em **Authentication → URL Configuration**:
   - **Site URL**: a URL do seu app (ex.: `https://seu-app.vercel.app`; em local, `http://localhost:3000`).
   - **Redirect URLs**: adicione `https://seu-app.vercel.app/**` e `http://localhost:3000/**`.
3. Em **Authentication → Email Templates → Magic Link**, troque o link do template para apontar para a rota de confirmação:

   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```

   Isso garante o fluxo seguro (PKCE) com `verifyOtp`. O app também tem `/auth/callback` como alternativa, então funciona com o link padrão também.

## 3. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Opcional — endpoint de execução. Padrão: API pública Piston.
PISTON_URL=https://emkc.org/api/v2/piston
```

Em produção (Vercel), defina as mesmas variáveis em **Project Settings → Environment Variables**, com `NEXT_PUBLIC_SITE_URL` igual à URL pública do app.

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Sem o Supabase configurado, o app abre em "modo de pré-visualização": você navega pela UI, mas o login e o salvamento ficam desativados.

> Recomendado: rode `npm run dev` (ou `npm run build`) **uma vez** antes do deploy para confirmar que tudo compila no seu ambiente.

## 5. Deploy na Vercel

1. Suba este projeto para um repositório (GitHub/GitLab/Bitbucket).
2. Na Vercel, **New Project → Import** o repositório.
3. Adicione as variáveis de ambiente (passo 3).
4. Deploy. A Vercel detecta Next.js automaticamente.
5. Depois do primeiro deploy, ajuste `NEXT_PUBLIC_SITE_URL` e as **Redirect URLs** do Supabase para a URL final.

---

## Como funciona a correção automática

O componente de prática envia o seu código para `POST /api/run`, que faz proxy para o **Piston** (sandbox público que compila e executa Java e Go). A saída do programa é comparada com a esperada (ignorando espaços/quebras no fim). Se bater, a lição é concluída e o XP é creditado.

- Exercícios de **Java** usam `public class Main` (arquivo `Main.java`).
- Exercícios de **Go** usam `package main` (arquivo `main.go`).

**Limites:** a API pública do Piston tem rate limit (~5 req/s). Para uso intenso ou em escala, hospede seu próprio Piston (https://github.com/engineer-man/piston) e aponte `PISTON_URL` para ele — nada mais muda.

## Como adicionar mais aulas

Todo o conteúdo é tipado e fica em `lib/content/`. Cada trilha (`java.ts`, `go.ts`, etc.) é um objeto `Track` com `modules[]` e `lessons[]`. Para adicionar uma lição, inclua um objeto `Lesson` com `id` único:

```ts
{
  id: "java-novo-topico",      // precisa ser único em todo o app
  title: "Título",
  minutes: 15,
  xp: 50,
  theory: `## Markdown aqui ...`,
  examples: [{ title, lang, code, note }],
  quiz: [{ q, options, answer, explain }],
  exercise: {
    prompt, lang: "java", starter, expectedOutput, hint, solution
  }
}
```

O markdown da teoria suporta `##`/`###`, listas `-`, **negrito**, `código`, blocos com ``` e citações `>`. O desbloqueio é linear por trilha (a próxima lição abre quando a anterior é concluída).

## Segurança (resumo)

- Apenas a **anon key** é usada; o acesso é protegido por **RLS** no Postgres.
- Cada usuário lê/escreve somente a própria linha de progresso.
- Login sem senha (magic link) — nada de senha para vazar.
- A rota de execução valida tamanho e linguagem antes de chamar o sandbox.
- A sessão é renovada via middleware; rotas protegidas redirecionam para `/login`.

## Estrutura

```
app/            rotas (App Router): login, auth, dashboard, trilha, licao, api
components/     UI (Staircase, LessonView, CodeRunner, Quiz, TopBar, Markdown)
lib/supabase/   clientes browser/server + middleware de sessão
lib/content/    currículo tipado (java, go, english, backend, ai)
lib/gamification.ts  XP, níveis, ofensiva e conquistas (lógica pura)
supabase/schema.sql  tabela + RLS
```

Bons estudos — e rumo ao topo. 🚀
