import type { Track } from "./types";

export const englishTrack: Track = {
  id: "english",
  title: "Inglês para Devs",
  subtitle: "O idioma da documentação, das entrevistas e do código",
  accent: "english",
  icon: "🗣️",
  modules: [
    {
      id: "en-vocab",
      step: 1,
      title: "Vocabulário técnico",
      icon: "📖",
      summary: "Os termos que aparecem em todo código e documentação.",
      lessons: [
        {
          id: "en-vocab-lesson",
          title: "O vocabulário que você lê todo dia",
          minutes: 15,
          xp: 40,
          theory: `## O inglês já está no seu código

Você programa em inglês sem perceber: \`return\`, \`if\`, \`while\`, \`array\`, \`string\`. Dominar o vocabulário acelera leitura de docs e desbloqueia oportunidades globais.

## Termos essenciais (EN → PT)

- **to deploy** → publicar/implantar | "We deploy on Fridays."
- **to merge** → integrar (branches) | "Merge your PR after review."
- **to ship** → entregar/lançar | "Ship it."
- **bug / issue** → erro / problema registrado
- **feature** → funcionalidade
- **request / response** → requisição / resposta
- **to fetch** → buscar (dados)
- **stateless / stateful** → sem / com estado
- **backward compatible** → compatível com versões anteriores
- **edge case** → caso extremo

## Dica de estudo

Configure sistema, IDE e celular em inglês. Imersão passiva diária vale mais que sessões longas e raras — e conversa direto com a constância (streak) deste app.`,
          quiz: [
            {
              q: "O que significa 'to deploy'?",
              options: ["Depurar", "Publicar/implantar", "Apagar", "Testar"],
              answer: 1,
            },
            {
              q: "'Edge case' se refere a:",
              options: [
                "Um caso comum",
                "Um caso extremo/limite",
                "Um erro de sintaxe",
                "Uma borda da tela",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "en-docs",
      step: 2,
      title: "Lendo documentação",
      icon: "🔎",
      summary: "Estratégias para consumir docs em inglês sem travar.",
      lessons: [
        {
          id: "en-docs-lesson",
          title: "Como ler docs em inglês com fluidez",
          minutes: 14,
          xp: 45,
          theory: `## Você não precisa entender cada palavra

Documentação técnica é **previsível**: tem padrões que se repetem. Aprenda a estrutura:

- **Overview / Getting started** — visão geral e primeiros passos.
- **API reference** — assinatura de cada função/parâmetro.
- **Examples** — quase sempre o atalho mais rápido.
- **Caveats / Gotchas** — armadilhas conhecidas (não pule!).

## Verbos imperativos das docs

Docs falam em modo imperativo: **Install**, **Configure**, **Run**, **Note that...**, **Make sure...**, **Avoid...**. Reconhecê-los já entrega a intenção.

## Estratégia prática

1. Leia o exemplo de código primeiro; o texto explica o exemplo.
2. Procure a assinatura: parâmetros (\`required\`/\`optional\`), tipo de retorno.
3. Em dúvida, traduza só o trecho-chave, não o parágrafo inteiro.
4. Use a busca da própria doc com o termo em inglês.`,
          quiz: [
            {
              q: "Numa doc, onde costuma estar o caminho mais rápido para entender o uso?",
              options: ["No rodapé", "Na seção Examples", "Na licença", "No changelog"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "en-writing",
      step: 3,
      title: "Escrevendo em inglês",
      icon: "✍️",
      summary: "Commits, PRs e mensagens claras para times globais.",
      lessons: [
        {
          id: "en-writing-lesson",
          title: "Commits e Pull Requests claros",
          minutes: 14,
          xp: 45,
          theory: `## Seu inglês escrito mais visível: o histórico do Git

**Commit messages** seguem convenção e modo imperativo, presente:

\`\`\`
fix: handle null user in login flow
feat: add CSV export to reports
docs: clarify setup steps
\`\`\`

Regra de ouro: complete a frase *"This commit will..."* → "...fix...", "...add...". Não use passado ("fixed", "added").

## Pull Request

Estruture com clareza:

- **What** — o que muda.
- **Why** — o motivo/contexto.
- **How to test** — como verificar.

## Frases prontas para revisão

- "Could you take a look when you have a moment?"
- "I left a couple of comments — nothing blocking."
- "LGTM" (*Looks Good To Me*) — aprovado.
- "Let's discuss this in the thread."

Escrever curto, direto e gentil é uma habilidade tão valiosa quanto o código.`,
          quiz: [
            {
              q: "Qual mensagem de commit segue a convenção (imperativo, presente)?",
              options: [
                "fixed the bug yesterday",
                "fix: handle null user in login",
                "I have added a feature",
                "bug",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "en-speaking",
      step: 4,
      title: "Falando em inglês",
      icon: "🎤",
      summary: "Standups, reuniões e entrevistas técnicas.",
      lessons: [
        {
          id: "en-speaking-lesson",
          title: "Standups e entrevistas técnicas",
          minutes: 16,
          xp: 50,
          theory: `## O daily standup

Três frases bastam:

- "Yesterday I worked on the login API."
- "Today I'm going to fix the failing tests."
- "I'm blocked on the staging deploy — I need access."

## Entrevista técnica: pense em voz alta

Recrutadores avaliam seu **raciocínio**, então narre:

- "Let me make sure I understand the requirements..."
- "My first approach would be... but it's O(n²), so let me optimize."
- "I'd use a hash map here to get O(1) lookups."
- "Let me walk through an edge case: an empty array."

## Frases de segurança

- "Could you repeat that, please?"
- "Just to confirm, you mean...?"
- "Give me a second to think about this."

Falar não precisa ser perfeito — precisa ser **claro**. Pratique narrando seus exercícios deste app em voz alta, em inglês.`,
          quiz: [
            {
              q: "Numa entrevista técnica, o que mais importa demonstrar?",
              options: [
                "Sotaque perfeito",
                "Seu raciocínio, pensando em voz alta",
                "Velocidade de digitação",
                "Memorizar a resposta",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
  ],
};
