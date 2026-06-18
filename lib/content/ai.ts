import type { Track } from "./types";

export const aiTrack: Track = {
  id: "ai",
  title: "IA para Desenvolvimento",
  subtitle: "Programar com IA como acelerador — sem virar refém dela",
  accent: "ai",
  icon: "🤖",
  modules: [
    {
      id: "ai-mindset",
      step: 1,
      title: "Modelo mental",
      icon: "🧠",
      summary: "O que a IA é boa, onde falha e como pensar a parceria.",
      lessons: [
        {
          id: "ai-mindset-lesson",
          title: "IA como copiloto, você no comando",
          minutes: 14,
          xp: 45,
          theory: `## O modelo mental certo

Um LLM (como o Claude) é um **previsor de texto muito bom**, treinado em código e linguagem. Ele é excelente em: boilerplate, explicar conceitos, traduzir entre linguagens, gerar testes, refatorar e revisar. É fraco em: garantir correção, conhecer seu contexto privado, e fatos recentes/exatos.

## A regra de ouro

> Você é responsável por todo código que entrega — mesmo o que a IA escreveu.

Trate sugestões como as de um colega rápido porém às vezes confiante demais: **revise sempre**. Aprender os fundamentos (as outras trilhas deste app) é o que te permite julgar se a saída está certa.

## Onde a IA acelera de verdade

- Sair do zero (scaffolding) e vencer a "página em branco".
- Entender código alheio rapidamente.
- Gerar variações e casos de teste.
- Aprender: peça explicações no seu nível.

A meta não é programar menos — é pensar em problemas maiores.`,
          quiz: [
            {
              q: "Quem é responsável pelo código gerado por IA que você entrega?",
              options: ["A IA", "A empresa da IA", "Você", "Ninguém"],
              answer: 2,
            },
            {
              q: "Em que a IA é naturalmente MAIS fraca?",
              options: [
                "Gerar boilerplate",
                "Garantir correção e conhecer seu contexto privado",
                "Explicar conceitos",
                "Sugerir nomes",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "ai-prompting",
      step: 2,
      title: "Prompting para código",
      icon: "💬",
      summary: "Como pedir para receber código útil e correto.",
      lessons: [
        {
          id: "ai-prompting-lesson",
          title: "A arte de pedir bem",
          minutes: 16,
          xp: 50,
          theory: `## Contexto é tudo

Bons resultados vêm de bons pedidos. Inclua:

1. **Objetivo** — o que você quer no fim.
2. **Contexto** — linguagem, versão, frameworks, restrições.
3. **Entrada/saída** — exemplos concretos.
4. **Formato** — "só o código", "com testes", "explique cada passo".

Pedido fraco: *"faça uma API"*.
Pedido forte: *"Crie um endpoint REST em Spring Boot (Java 21) que recebe um JSON {nome, email}, valida o email, salva via JPA e retorna 201. Inclua tratamento de erro 400."*

## Técnicas que funcionam

- **Peça raciocínio passo a passo** em problemas complexos.
- **Dê exemplos** (poucos exemplos guiam o formato).
- **Itere**: refine em vez de recomeçar. "Quase isso — agora torne thread-safe."
- **Peça testes junto**: forçam a IA (e você) a pensar em casos extremos.
- **Peça alternativas**: "me dê 2 abordagens com trade-offs."

Você pode ler mais em docs.claude.com/.../prompt-engineering.`,
          quiz: [
            {
              q: "O que mais melhora a qualidade de uma resposta de código da IA?",
              options: [
                "Pedir o mais curto possível",
                "Dar objetivo, contexto, exemplos e formato esperado",
                "Usar só uma palavra",
                "Pedir em maiúsculas",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "ai-workflow",
      step: 3,
      title: "Fluxos de trabalho",
      icon: "🔁",
      summary: "Integrar IA no ciclo: explicar, gerar, testar, revisar.",
      lessons: [
        {
          id: "ai-workflow-lesson",
          title: "IA no seu ciclo de desenvolvimento",
          minutes: 16,
          xp: 55,
          theory: `## Onde encaixar a IA no dia a dia

- **Entender** — cole código legado e peça um resumo do que faz.
- **Planejar** — descreva a feature e peça um plano e os arquivos a tocar.
- **Gerar** — produza a primeira versão e os testes.
- **Revisar** — peça para a IA criticar seu próprio código (segurança, edge cases).
- **Depurar** — cole o erro + o trecho e peça hipóteses.
- **Aprender** — peça explicações quando não entender a saída.

## Ferramentas (panorama)

- **Assistentes em chat** (Claude) — raciocínio, planejamento, explicação.
- **Autocompletar no editor** (Copilot e afins) — sugestões inline.
- **Agentes** (Claude Code) — executam tarefas de várias etapas no terminal/projeto.

## Anti-padrões a evitar

- Aceitar código sem ler.
- Colar segredos/credenciais em prompts.
- Pedir "conserte tudo" em vez de problemas focados.
- Parar de aprender os fundamentos — eles são seu controle de qualidade.`,
          quiz: [
            {
              q: "Qual destes é um BOM uso de IA no fluxo de trabalho?",
              options: [
                "Aceitar todo código sem revisar",
                "Pedir para a IA revisar seu código buscando edge cases e falhas de segurança",
                "Colar chaves de API no prompt",
                "Parar de aprender os fundamentos",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "ai-safety",
      step: 4,
      title: "Riscos, revisão e segurança",
      icon: "🛡️",
      summary: "Alucinações, vazamento de dados e código seguro com IA.",
      lessons: [
        {
          id: "ai-safety-lesson",
          title: "Usando IA com responsabilidade",
          minutes: 16,
          xp: 60,
          theory: `## Os riscos reais

- **Alucinação** — a IA inventa funções, APIs ou fatos com confiança. Sempre verifique nomes de bibliotecas e assinaturas na documentação oficial.
- **Vazamento de dados** — não cole código proprietário, segredos ou dados de clientes em ferramentas não aprovadas pela sua empresa.
- **Código inseguro** — IA pode gerar SQL concatenado (injection), deps desatualizadas ou validação fraca. Revise como revisaria o de um colega.
- **Viés de automação** — confiar demais só porque "veio da IA". Mantenha o ceticismo.

## Checklist de revisão de código gerado

1. Eu entendo cada linha? Se não, pergunte ou estude antes de mergear.
2. Há validação de entrada e tratamento de erro?
3. Existe risco de injection/secret hardcoded?
4. As dependências existem e são confiáveis?
5. Há testes cobrindo o caminho feliz e os edge cases?

## O equilíbrio

A IA multiplica quem já sabe — e amplifica os erros de quem não revisa. Por isso este app combina IA **com** fundamentos: você termina capaz de usar a IA como alavanca, não como muleta.`,
          quiz: [
            {
              q: "O que é 'alucinação' no contexto de LLMs?",
              options: [
                "Quando a IA fica lenta",
                "Quando a IA inventa fatos/APIs com confiança",
                "Um erro de rede",
                "Um tipo de teste",
              ],
              answer: 1,
            },
            {
              q: "Qual prática é insegura ao usar IA?",
              options: [
                "Revisar o código gerado",
                "Verificar nomes de bibliotecas na doc oficial",
                "Colar segredos e dados de clientes no prompt",
                "Pedir testes junto",
              ],
              answer: 2,
            },
          ],
        },
      ],
    },
  ],
};
