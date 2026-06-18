import type { Track } from "./types";

export const backendTrack: Track = {
  id: "backend",
  title: "Backend (Fundamentos)",
  subtitle: "Os conceitos que valem para Java, Go ou qualquer stack",
  accent: "backend",
  icon: "🛠️",
  modules: [
    {
      id: "be-http",
      step: 1,
      title: "HTTP e REST a fundo",
      icon: "🌐",
      summary: "Como a web realmente conversa: métodos, headers, status.",
      lessons: [
        {
          id: "be-http-lesson",
          title: "Anatomia de uma requisição HTTP",
          minutes: 16,
          xp: 50,
          theory: `## O protocolo que move a web

Cliente envia uma **requisição**; servidor devolve uma **resposta**. Toda requisição tem:

- **Método** — GET, POST, PUT, PATCH, DELETE.
- **URL/Path** — o recurso.
- **Headers** — metadados (\`Content-Type\`, \`Authorization\`).
- **Body** — dados (em POST/PUT), normalmente JSON.

\`\`\`
POST /api/users HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{ "name": "Ana" }
\`\`\`

## Idempotência e segurança

- **GET** é seguro (não muda estado) e cacheável.
- **PUT** e **DELETE** são idempotentes (repetir = mesmo efeito).
- **POST** não é idempotente (repetir cria duplicatas) — use chaves de idempotência em pagamentos.

## Stateless

HTTP é sem estado: cada requisição é independente. O estado vai no token/cookie ou no servidor (banco/cache). Isso é o que permite escalar horizontalmente.`,
          quiz: [
            {
              q: "Qual método HTTP é idempotente E seguro (não altera estado)?",
              options: ["POST", "GET", "PATCH", "DELETE"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "be-auth",
      step: 2,
      title: "Autenticação e Autorização",
      icon: "🔐",
      summary: "Sessões, tokens JWT, hashing de senha e OAuth.",
      lessons: [
        {
          id: "be-auth-lesson",
          title: "Auth do jeito certo",
          minutes: 18,
          xp: 60,
          theory: `## Autenticação ≠ Autorização

- **Autenticação** — quem você é (login).
- **Autorização** — o que você pode fazer (permissões).

## Senhas: nunca em texto puro

Sempre faça **hash** com algoritmos lentos e com *salt*: \`bcrypt\`, \`argon2\`. Nunca \`md5\`/\`sha1\` puro, nunca guardar a senha original.

## Sessões x Tokens

- **Sessão** — servidor guarda o estado; cookie carrega o id da sessão.
- **JWT** — token assinado e *stateless*; o servidor valida a assinatura sem consultar storage. Ótimo para escalar, mas revogação é mais difícil.

\`\`\`
header.payload.signature   <- estrutura de um JWT
\`\`\`

## Magic link (como o login deste app)

O usuário recebe um link de uso único por e-mail; clicar prova posse do e-mail. Sem senha para vazar. É a abordagem que o Supabase implementa aqui.

## Regras de ouro

- HTTPS sempre. Tokens em cookies \`HttpOnly\` quando possível.
- Princípio do menor privilégio.
- Valide entrada no servidor — nunca confie só no cliente.`,
          quiz: [
            {
              q: "Como senhas devem ser armazenadas?",
              options: [
                "Em texto puro para facilitar",
                "Com hash lento + salt (bcrypt/argon2)",
                "Criptografadas de forma reversível",
                "Em base64",
              ],
              answer: 1,
            },
            {
              q: "Qual a diferença entre autenticação e autorização?",
              options: [
                "São a mesma coisa",
                "Autenticação = quem você é; autorização = o que pode fazer",
                "Autorização vem antes do login",
                "Autenticação define permissões",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "be-data",
      step: 3,
      title: "Modelagem de dados",
      icon: "🗄️",
      summary: "Normalização, índices, transações e SQL x NoSQL.",
      lessons: [
        {
          id: "be-data-lesson",
          title: "Modelando dados que escalam",
          minutes: 18,
          xp: 60,
          theory: `## Relacional x NoSQL

- **SQL** (Postgres, MySQL) — esquema rígido, JOINs, transações ACID. Padrão para dados estruturados e relações.
- **NoSQL** (Mongo, DynamoDB) — flexível, escala horizontal, modelado para padrões de acesso específicos.

Comece com SQL salvo motivo forte para o contrário.

## Transações ACID

- **Atomicidade** — tudo ou nada.
- **Consistência** — regras sempre válidas.
- **Isolamento** — transações concorrentes não se atrapalham.
- **Durabilidade** — uma vez confirmado, persiste.

## Índices

Aceleram leituras em colunas filtradas/ordenadas, ao custo de escritas e espaço. Indexe chaves estrangeiras e colunas de busca frequente — não tudo.

## N+1 e paginação

Evite consultas em loop (N+1) usando JOIN. Para listas grandes, **pagine** (cursor é melhor que offset em escala). Esses princípios reaparecem em JPA, no Go e em qualquer ORM.`,
          quiz: [
            {
              q: "O que significa o 'A' de ACID?",
              options: ["Assíncrono", "Atomicidade", "Auditável", "Anônimo"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "be-perf",
      step: 4,
      title: "Cache e performance",
      icon: "⚡",
      summary: "Latência, caching, filas e estratégias de escala.",
      lessons: [
        {
          id: "be-perf-lesson",
          title: "Caching, filas e o caminho para escalar",
          minutes: 18,
          xp: 65,
          theory: `## Meça antes de otimizar

"Premature optimization is the root of all evil." Use métricas (latência p95/p99, throughput) para achar o gargalo real.

## Cache

Guarde resultados caros para reuso (Redis, CDN). O difícil é a **invalidação** — quando o dado muda. Estratégias:

- **Cache-aside** — app consulta o cache; se não tiver, busca no banco e popula.
- **TTL** — expira após um tempo.

> "There are only two hard things in CS: cache invalidation and naming things."

## Filas e processamento assíncrono

Tarefas pesadas (e-mail, relatório, vídeo) não devem bloquear a resposta. Jogue numa **fila** (Kafka, RabbitMQ, SQS) e processe em background. Benefícios: absorve picos, desacopla, permite retry.

## Caminho de escala (resumo)

1. Otimize consultas e adicione índices.
2. Cache nas leituras quentes.
3. Réplicas de leitura.
4. Filas para trabalho assíncrono.
5. Sharding/particionamento quando necessário.

Tudo isso converge no System Design — o topo da trilha Java.`,
          quiz: [
            {
              q: "Por que mover tarefas pesadas para uma fila?",
              options: [
                "Para deixar o código mais bonito",
                "Para não bloquear a resposta, absorver picos e permitir retry",
                "Porque filas são obrigatórias",
                "Para economizar memória do cliente",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
  ],
};
